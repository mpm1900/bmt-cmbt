import {
  getAliveInactiveActors,
  hasActiveActorSpace,
  mapActor,
  mapTarget,
} from '@/game/access'
import {
  activateActorResolver,
  deactivateActorResolver,
} from '@/game/resolvers'
import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

const Swap: SAction = {
  ID: v4(),
  name: 'Activate Actor',
  validate: (state, context) => {
    const targets = getAliveInactiveActors(state, context)
    return hasActiveActorSpace(state, context.playerID) && targets.length > 0
  },
  targets: {
    unique: true,
    max: () => 1,
    get: (state, context) =>
      getAliveInactiveActors(state, context).map((a) =>
        mapTarget(a, 'targetID')
      ),
    validate: (_state, context) => {
      return context.targetIDs.length === 1
    },
  },
  ai: {
    compute: (state, context) =>
      mapActor(state, context.targetIDs[0], (a) => 1000 - a.state.damage) ?? 0,
    generateContexts: (state, context, action) => {
      const actors = action.targets.get(state, context)
      return actors.map((a) => ({
        ...context,
        targetIDs: [a.target.ID],
      }))
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
    targets: {
      ...Swap.targets,
      max: () => count,
      validate: (_state, context) => context.targetIDs.length === count,
    },
  }
}

export { Swap, SwapWith }
