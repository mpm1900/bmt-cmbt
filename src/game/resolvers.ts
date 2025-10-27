import type {
  Delta,
  DeltaContext,
  DeltaPositionContext,
  DeltaQueueItem,
  DeltaResolver,
} from '@/game/types/delta'
import type {
  Combat,
  SAction,
  SActor,
  SDialogMessage,
  SEffect,
  SMutation,
  State,
} from '@/game/state'
import { v4 } from 'uuid'
import { withState } from '@/game/actor'
import {
  decrementEffectItem,
  filterActionQueue,
  handleTrigger,
  mutateActor,
  mutateDamage,
  mutatePlayer,
  newContext,
  pushLogs,
} from '@/game/mutations'
import type { ActorState } from './types/actor'
import type { Damage } from './types/damage'
import type { Player } from './types/player'
import { convertPositionToTargetContext, findActor, getActor } from './access'
import { chance } from '@/lib/chance'

function resolveAction(
  state: State,
  context: DeltaPositionContext,
  resolver: DeltaResolver<State, DeltaPositionContext, DeltaContext>
): DeltaQueueItem<State, DeltaContext>[] {
  if (!resolver.validate(state, context)) {
    // likely an AI action
    console.error('resolver validation failed', resolver, state, context)
    const action = resolver as SAction
    if (action.name) {
      return [pushLogResolver(context, () => `${action.name} failed.`)]
    }
    return []
  }
  const resolverContext = convertPositionToTargetContext(state, context)
  return resolver.resolve(state, resolverContext).flatMap((m) => m)
}

function costResolver(
  context: DeltaContext,
  fn: (s: ActorState) => Partial<ActorState>
): SMutation {
  const cost: Delta<State> = {
    apply: (state, context) =>
      mutateActor(state, context, {
        filter: (a) => a.ID === context.sourceID,
        apply: (a) => withState(a, fn(a.state)),
      }),
  }

  return {
    ID: v4(),
    delta: cost,
    context,
  }
}

function pushLogResolver(
  context: DeltaContext,
  logFn: (state: State, context: DeltaContext) => State['combatLog'][number]
): SMutation {
  const delta: Delta<State> = {
    apply: (state, context) => pushLogs(state, [logFn(state, context)]),
  }

  return {
    ID: v4(),
    delta,
    context,
  }
}

function pushMessagesResolver(
  context: DeltaContext,
  messages: SDialogMessage[]
): SMutation {
  const delta: Delta<State> = {
    apply: (state, _context) => ({
      ...state,
      messageLog: state.messageLog.concat(messages),
    }),
  }

  return {
    ID: v4(),
    delta,
    context,
  }
}

function mutateActorResolver(
  targetID: string,
  context: DeltaContext,
  fn: (a: SActor) => SActor
): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state: State) =>
        mutateActor(state, context, {
          filter: (a) => a.ID === targetID,
          apply: fn,
        }),
    },
  }
}

function mutatePlayerResolver(
  playerID: string,
  context: DeltaContext,
  fn: (p: Player) => Player
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
  actorID: string,
  context: DeltaContext
): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state: State) => {
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

        state = pushLogs(state, [
          `${findActor(state, actorID)?.name} joined the battle.`,
        ])
        state = handleTrigger(state, context, 'on-actor-activate')
        return state
      },
    },
  }
}

function deactivateActorResolver(
  playerID: string,
  actorID: string,
  context: DeltaContext
): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state: State) => {
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

function addEffectResolver(effect: SEffect, context: DeltaContext): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state, context) => {
        return {
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
      },
    },
  }
}

function damagesResolver(
  context: DeltaContext,
  damages: Array<Damage>,
  contexts: Array<DeltaContext>
): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state: State, dcontext: DeltaContext) => {
        console.log('damages resolver', dcontext, damages)
        state = damages.reduce((next, damage, index) => {
          const ctx = contexts[index] ?? dcontext
          const source = getActor(next, ctx.sourceID)

          if (damage.type === 'power' && source) {
            if (!damage.success) {
              next = pushLogs(next, [`${source.name}'s attack missed.`])
            } else if (damage.evade) {
              const target = getActor(next, ctx.targetIDs[0])
              next = pushLogs(next, [`${target?.name} evaded the attack.`])
            }
          }

          next = mutateDamage(next, ctx, damage)
          return next
        }, state)
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

function startCombatResolver(
  combat: Combat,
  preState: Partial<State>
): SMutation {
  return {
    ID: v4(),
    context: newContext({}),
    delta: {
      apply: (state, _context) => {
        const { actors = [], players = [], ...rest } = preState
        return {
          ...state,
          actionQueue: [],
          triggerQueue: [],
          mutationQueue: [],
          promptQueue: [],
          players: state.players.concat(players),
          actors: state.actors.concat(actors),
          combat,
          combatLog: ['Combat started.'],
          ...rest,
        }
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
        const active = state.dialog.nodes.find((node) => node.ID === nodeID)!
        active.checks(state, context).forEach((check) => {
          const [success, roll] = chance(check.chance)

          if (success && check.success) {
            state.mutationQueue.push(...check.success(roll))
          }
          if (!success && check.failure) {
            state.mutationQueue.push(...check.failure(roll))
          }
        })

        return {
          ...state,
          messageLog: state.messageLog.concat(active.messages(state, context)),
          dialog: {
            ...state.dialog,
            activeNodeID: nodeID,
          },
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
  pushLogResolver,
  mutatePlayerResolver,
  mutateActorResolver,
  decrementEffectsResolver,
  addEffectResolver,
  damagesResolver,
  nextTurnResolver,
  activateActorResolver,
  deactivateActorResolver,
  startCombatResolver,
  navigateDialogResolver,
}
