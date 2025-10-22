import type { Delta, DeltaContext } from '@/game/types/delta'
import type { SActor, SEffect, SMutation, State } from '@/game/state'
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
import { findActor, getActor } from './access'

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
          `Activated ${findActor(state, actorID)?.name}`,
        ])
        state = handleTrigger(state, context, 'onActorActivate')
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
        state = handleTrigger(state, context, 'onActorDeactivate')
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
      apply: (state: State, _context: DeltaContext) => {
        if (!state.battle) return state
        return {
          ...state,
          battle: {
            ...state.battle,
            turn: state.battle.turn + 1,
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
  costResolver,
  pushLogResolver,
  mutatePlayerResolver,
  mutateActorResolver,
  decrementEffectsResolver,
  addEffectResolver,
  damagesResolver,
  nextTurnResolver,
  activateActorResolver,
  deactivateActorResolver,
}
