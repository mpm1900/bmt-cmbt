import type { Delta, DeltaContext, DeltaQueueItem } from '@/game/types/delta'
import type { SActor, SEffect, State } from '@/game/state'
import { v4 } from 'uuid'
import { withState } from '@/game/actor'
import { mutateActor, mutateDamage } from '@/game/mutations'
import type { ActorState } from './types/actor'
import type { Damage } from './types/damage'

function costResolver(
  context: DeltaContext,
  fn: (s: ActorState) => Partial<ActorState>
): DeltaQueueItem<State> {
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
): DeltaQueueItem<State> {
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

function addEffectResolver(
  effect: SEffect,
  context: DeltaContext
): DeltaQueueItem<State> {
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

function damageResolver(
  context: DeltaContext,
  damage: Damage
): DeltaQueueItem<State> {
  return {
    ID: v4(),
    context,
    delta: {
      apply: (state: State, context: DeltaContext) =>
        mutateDamage(state, context, damage),
    },
  }
}

export { costResolver, mutateActorResolver, addEffectResolver, damageResolver }
