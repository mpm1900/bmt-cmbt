import type { Delta, DeltaContext, DeltaQueueItem } from '@/game/types/delta'
import type {
  SCombat,
  SAction,
  SActor,
  SEffect,
  SMutation,
  State,
  SPlayer,
  SEncounter,
} from '@/game/state'
import { v4 } from 'uuid'
import {
  decrementActorCooldowns,
  filterActionQueue,
  handleTrigger,
  incrementNodeCount,
  mutateActor,
  mutateDamage,
  mutatePlayer,
  newContext,
  purchaseItem,
  pushMessages,
  removeParentEffects,
  setEncounter,
} from '@/game/mutations'
import type { ActorState } from './types/actor'
import type { Damage } from './types/damage'
import {
  convertPositionToTargetContext,
  findActor,
  getActor,
  isActive,
} from './access'
import { chance } from '@/lib/chance'
import { enqueue } from './lib/queue'
import type { Message } from './types/message'
import { newMessage } from './encounter'
import {
  ActorActivated,
  ActorDeactivated,
  ActorDied,
  ActorProtected,
  CriticalHit,
  ParentEffect,
  SeporatorTop,
  SourceMissed,
  TargetEvade,
  TargetHeal,
} from './data/messages'
import { withHeal, withState } from './lib/actor'
import { validateAction } from './action'
import { withActiveSize } from './player'
import { decrementEffectItem } from './lib/effect'
import { gameUIStore } from '@/hooks/useGameUI'

function resolveAction(
  state: State,
  context: DeltaContext,
  action: SAction
): Array<DeltaQueueItem<State, DeltaContext>> {
  if (!validateAction(action, state, context)) {
    // likely an AI action
    console.error('resolver validation failed', action, state, context)
    if (action.name) {
      return [
        pushMessagesResolver(context, [
          newMessage({ text: `${action.name} failed.`, depth: 1 }),
        ]),
      ]
    }
    return []
  }
  const resolverContext = convertPositionToTargetContext(state, context)
  return action.resolve(state, resolverContext).flatMap((m) => m)
}

function costResolver(
  context: DeltaContext,
  fn: (s: ActorState) => Partial<ActorState>
): SMutation {
  const cost: Delta<State> = {
    apply: (state, context) =>
      mutateActor(state, context, {
        filter: (a) => a.ID === context.sourceID,
        apply: (a) => withState<State>(a, fn(a.state)),
      }),
  }

  return {
    ID: v4(),
    delta: cost,
    context,
  }
}

function pushMessagesResolver(
  context: DeltaContext,
  messages: Array<Message>
): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state, _context) => pushMessages(state, messages),
    },
  }
}

function mutateActorResolver(
  targetID: string,
  context: DeltaContext,
  fn: (a: SActor) => SActor
): SMutation {
  return {
    ID: 'mutatate actor' + v4(),
    context,
    delta: {
      apply: (state: State) => {
        return mutateActor(state, context, {
          filter: (a) => a.ID === targetID,
          apply: fn,
        })
      },
    },
  }
}

function healActorResolver(
  targetID: string | undefined,
  context: DeltaContext,
  amount: number
): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state: State) => {
        let healed = 0
        state = mutateActor(state, context, {
          filter: (a) => a.ID === targetID,
          apply: (a) => {
            const damage = Math.max(a.state.damage - amount, 0)
            healed += a.state.damage - damage
            return withHeal<State>(a, amount)
          },
        })

        state = pushMessages(state, [
          newMessage({
            text: TargetHeal(findActor(state, targetID), healed),
            depth: 1,
          }),
        ])
        return state
      },
    },
  }
}

function mutatePlayerResolver(
  playerID: string,
  context: DeltaContext,
  fn: (p: SPlayer) => SPlayer
): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state: State) =>
        mutatePlayer(state, context, {
          filter: (p) => p.ID === playerID,
          apply: fn,
        }),
    },
  }
}

function activateActorResolver(
  playerID: string,
  actorID: string | undefined,
  context: DeltaContext,
  depth: number
): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state: State) => {
        if (!actorID) return state
        const player = state.players.find((p) => p.ID === playerID)!
        const index = player.activeActorIDs.indexOf(null)
        const aindex = player.activeActorIDs.indexOf(actorID)
        if (index === -1) {
          // no space
          console.error('NO SPACE')
          return state
        }
        if (aindex !== -1) {
          // already active
          console.error('ALREADY ACTIVE')
          return state
        }

        state = mutatePlayer(state, context, {
          filter: (p) => p.ID === playerID,
          apply: (p) => ({
            ...p,
            activeActorIDs: p.activeActorIDs.map((id, i) =>
              i === index ? actorID : id
            ),
          }),
        })

        state = pushMessages(state, [
          newMessage({
            text: ActorActivated(findActor(state, actorID), !!state.combat),
            depth,
          }),
        ])
        state = handleTrigger(
          state,
          {
            ...context,
            sourceID: actorID,
          },
          'on-actor-activate'
        )
        return state
      },
    },
  }
}

function deactivateActorResolver(
  playerID: string,
  actorID: string | undefined,
  context: DeltaContext,
  depth = 1
): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state: State) => {
        if (!actorID) return state
        if (state.combat && !isActive(state, actorID)) return state

        const actor = findActor(state, actorID)!
        if (actor.state.alive === 0) {
          state = pushMessages(state, [
            newMessage({ text: ActorDied(actor), depth }),
          ])
        } else {
          state = pushMessages(state, [
            newMessage({ text: ActorDeactivated(actor), depth }),
          ])
        }

        if (!isActive(state, actorID)) {
          console.log(
            'cannot deactivate inactive actor. Likely killed while inactive.'
          )
          return state
        }
        const player = state.players.find((p) => p.ID === playerID)!
        const index = player.activeActorIDs.indexOf(actorID)
        if (index === -1) {
          if (actorID) {
            // actor not found
            console.error('ACTOR NOT FOUND', actorID, playerID, context)
          }
          return state
        }

        state = mutatePlayer(state, context, {
          filter: (p) => p.ID === playerID,
          apply: (p) => ({
            ...p,
            activeActorIDs: p.activeActorIDs.map((id, i) =>
              i === index ? null : id
            ),
          }),
        })

        state = filterActionQueue(state, actorID)
        state = removeParentEffects(state, newContext({ parentID: actorID }))
        state = handleTrigger(state, context, 'on-actor-deactivate')

        return state
      },
    },
  }
}

function decrementEffectsResolver(): SMutation {
  return {
    ID: v4(),
    context: newContext({}),
    delta: {
      apply: (state, _context) => {
        return {
          ...state,
          effects: state.effects
            .map((item) => decrementEffectItem(item))
            .filter((item) => item.effect.duration !== 0),
        }
      },
    },
  }
}

function addEffectResolver(
  effect: SEffect,
  context: DeltaContext,
  depth: number
): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state, context) => {
        state = {
          ...state,
          effects: [
            ...state.effects,
            {
              ID: v4(),
              effect,
              context,
            },
          ],
        }

        state = pushMessages(state, [
          newMessage({
            text: ParentEffect(
              findActor(state, context.parentID),
              effect.ID,
              effect.name
            ),
            depth: depth + 1,
          }),
        ])

        return state
      },
    },
  }
}

function damagesResolver(
  context: DeltaContext,
  damages: Array<Damage>,
  contexts: Array<DeltaContext> = [],
  depth: number = 0
): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state: State, dcontext: DeltaContext) => {
        damages.forEach((damage, index) => {
          const ctx = contexts[index] ?? dcontext
          const source = getActor(state, ctx.sourceID)
          const target = getActor(state, ctx.targetIDs[0])

          // if already dead, don't make any more triggers
          if (!target?.state.alive) return

          state = mutateDamage(state, ctx, damage, {
            depth,
          })

          if (target?.state.protected && !damage.bypassProtected) {
            state = pushMessages(state, [
              newMessage({
                context,
                text: ActorProtected(target),
                depth: depth + 1,
              }),
            ])
          }
          if (damage.type === 'power' && source) {
            if (damage.critical && target?.state.alive) {
              state = pushMessages(state, [
                newMessage({ text: CriticalHit(), depth: depth + 1 }),
              ])
            }
            if (!damage.success && target?.state.alive) {
              state = pushMessages(state, [
                newMessage({
                  text: SourceMissed(source),
                  depth: depth + 1,
                }),
              ])
              // can't evade crits
            } else if (damage.evade && !damage.critical) {
              state = pushMessages(state, [
                newMessage({
                  text: TargetEvade(target),
                  depth: depth + 1,
                }),
              ])
            }
          }
        })
        return state
      },
    },
  }
}

function nextTurnResolver(context: DeltaContext): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state, _context) => {
        state = decrementActorCooldowns(state)
        if (!state.combat) return state
        return {
          ...state,
          combat: {
            ...state.combat,
            turn: state.combat.turn + 1,
          },
        }
      },
    },
  }
}

function addPlayerResolver(player: SPlayer, actors: SActor[]): SMutation {
  return {
    ID: v4(),
    context: newContext({}),
    delta: {
      apply: (state, _context) => {
        if (!!state.players.find((p) => p.ID === player.ID)) return state
        return {
          ...state,
          players: [...state.players, player],
          actors: [...state.actors, ...actors],
        }
      },
    },
  }
}

function startCombatResolver(
  combat: SCombat,
  preState: Partial<State>,
  options: {
    activeSize: number
  }
): SMutation {
  return {
    ID: v4(),
    context: newContext({}),
    delta: {
      apply: (state, context) => {
        let { actors = [], players = [], ...rest } = preState
        state = pushMessages(state, [
          newMessage({ text: SeporatorTop(`Combat started!`), depth: 0 }),
        ])

        actors = actors.filter(
          (a) => !state.actors.find((sa) => sa.ID === a.ID)
        )
        players = players.filter(
          (p) => !state.players.find((sp) => sp.ID === p.ID)
        )

        state = {
          ...state,
          actionQueue: [],
          triggerQueue: [],
          mutationQueue: [],
          promptQueue: [],
          players: state.players
            .concat(players)
            .map((p) => withActiveSize(p, options.activeSize)),
          actors: state.actors.concat(actors),
          combat,
          combatLog: [],
          ...rest,
        }

        state = handleTrigger(state, context, 'on-combat-start')
        gameUIStore.getState().set({ activePlayerTab: 'combat-log' })
        return state
      },
    },
  }
}

function navigateDialogResolver(
  nodeID: string,
  context: DeltaContext
): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state, context) => {
        const active = state.encounter.nodes.find((node) => node.ID === nodeID)!
        if (active.type == 'options') {
          active.checks(state, context).forEach((check) => {
            const [success, roll] = chance(check.chance)

            if (success && check.success) {
              state.mutationQueue = enqueue(
                state.mutationQueue,
                check.success(roll)
              )
            }
            if (!success && check.failure) {
              state.mutationQueue = enqueue(
                state.mutationQueue,
                check.failure(roll)
              )
            }
          })
        }

        state = incrementNodeCount(state, nodeID)
        state.mutationQueue = enqueue(state.mutationQueue, [
          pushMessagesResolver(context, active.messages(state, context)),
        ])
        state = setEncounter(state, {
          ...state.encounter,
          activeNodeID: nodeID,
          nodeHistory: [...state.encounter.nodeHistory, nodeID],
        })

        return state
      },
    },
  }
}

function purchaseItemResolver(
  context: DeltaContext,
  itemID: string
): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state, context) => {
        return purchaseItem(state, context.playerID, itemID)
      },
    },
  }
}

function navigateEncounterResolver(
  context: DeltaContext,
  encounter: SEncounter
): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state) => {
        console.log(state)
        state = {
          ...state,
          players: state.players.filter((p) => p.ID !== state.encounter.ID),
          actors: state.actors.filter((a) => a.ID !== state.encounter.ID),
        }
        console.log(state)
        if (state.encounter.persist) {
          state = {
            ...state,
            pastEncounters: {
              ...state.pastEncounters,
              [state.encounter.ID]: state.encounter,
            },
          }
        }

        state = setEncounter(state, encounter)
        return {
          ...state,
          messageLog: [],
        }
      },
    },
  }
}

function emptyResolver(context: DeltaContext): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state: State, _context: DeltaContext) => state,
    },
  }
}

export {
  emptyResolver,
  resolveAction,
  costResolver,
  pushMessagesResolver,
  mutatePlayerResolver,
  mutateActorResolver,
  healActorResolver,
  decrementEffectsResolver,
  addEffectResolver,
  damagesResolver,
  nextTurnResolver,
  activateActorResolver,
  deactivateActorResolver,
  addPlayerResolver,
  startCombatResolver,
  navigateDialogResolver,
  purchaseItemResolver,
  navigateEncounterResolver,
}
