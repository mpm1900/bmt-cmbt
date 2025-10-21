import type { Delta, DeltaContext } from '@/game/types/delta'
import type { SActor, SEffect, SMutation, State } from '@/game/state'
import { v4 } from 'uuid'
import { withState } from '@/game/actor'
import {
  decrementEffectItem,
  handleTrigger,
  mutateActor,
  mutateDamage,
  mutatePlayer,
  newContext,
} from '@/game/mutations'
import type { ActorState } from './types/actor'
import type { Damage } from './types/damage'
import type { Player } from './types/player'

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
            console.error('ACTOR NOT FOUND', actorID)
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

function damageResolver(context: DeltaContext, damage: Damage): SMutation {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state: State, context: DeltaContext) =>
        mutateDamage(state, context, damage),
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
  mutatePlayerResolver,
  mutateActorResolver,
  decrementEffectsResolver,
  addEffectResolver,
  damageResolver,
  nextTurnResolver,
  activateActorResolver,
  deactivateActorResolver,
}
