import { isActive, mapTarget } from '@/game/access'
import {
  activateActorResolver,
  deactivateActorResolver,
} from '@/game/resolvers'
import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

const Swap: SAction = {
  ID: v4(),
  name: 'Activate',
  validate: (_state, context) => context.targetIDs.length === 1,
  targets: {
    unique: true,
    max: () => 1,
    get: (state, context) => {
      return state.actors
        .filter(
          (a) =>
            !isActive(state, a.ID) &&
            a.playerID == context.playerID &&
            a.state.alive
        )
        .map((a) => mapTarget(a, 'targetID'))
    },
  },
  resolve: (_, context) => {
    return [
      deactivateActorResolver(context.playerID, context.sourceID, context),
      context.targetIDs.map((targetID) =>
        activateActorResolver(context.playerID, targetID, context)
      ),
    ]
  },
}

function SwapWith(count: number): SAction {
  return {
    ...Swap,
    validate: (_state, context) => context.targetIDs.length === count,
    targets: {
      ...Swap.targets,
      max: () => count,
    },
  }
}

export { Swap, SwapWith }
