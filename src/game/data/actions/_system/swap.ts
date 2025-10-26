import {
  getAliveActiveActors,
  getAliveInactiveActors,
  hasActiveActorSpace,
  mapActor,
  mapTarget,
} from '@/game/access'
import {
  activateActorResolver,
  deactivateActorResolver,
} from '@/game/resolvers'
import type { SDialogAction } from '@/game/state'
import { v4 } from 'uuid'

const Swap: SDialogAction = {
  ID: v4(),
  name: 'Swap Actors',
  validate: (state, context) => {
    const targets = getAliveInactiveActors(state, context)
    const valid = context.sourceID
      ? true
      : hasActiveActorSpace(state, context.playerID) && targets.length > 0
    return valid
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
  sources: (state, context) => getAliveActiveActors(state, context),
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

function SwapWith(count: number): SDialogAction {
  return {
    ...Swap,
    targets: {
      ...Swap.targets,
      max: () => count,
      validate: (_state, context) => context.targetIDs.length === count,
    },
  }
}

const Activate: SDialogAction = {
  ...Swap,
  ID: v4(),
  name: 'Activate Actor',
  validate: (state, context) => {
    const targets = getAliveInactiveActors(state, context)

    const valid =
      targets.length > 0 && hasActiveActorSpace(state, context.playerID)
    return valid
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
  sources: () => [],
  resolve: (_, context) => {
    return context.targetIDs.map((id) =>
      activateActorResolver(context.playerID, id, context)
    )
  },
}

function ActivateX(x: number): SDialogAction {
  return {
    ...Activate,
    targets: {
      ...Swap.targets,
      max: () => x,
      validate: (_state, context) => context.targetIDs.length === x,
    },
  }
}

const Deactivate: SDialogAction = {
  ...Swap,
  ID: v4(),
  validate: (state, context) => {
    const targets = getAliveActiveActors(state, context)
    const valid = targets.length > 0
    return valid
  },
  targets: {
    unique: true,
    max: () => 1,
    get: (state, context) =>
      getAliveActiveActors(state, context).map((a) => mapTarget(a, 'targetID')),
    validate: (_state, context) => {
      return context.targetIDs.length === 1
    },
  },
  resolve: (_, context) => {
    return [
      deactivateActorResolver(context.playerID, context.targetIDs[0], context),
    ]
  },
  sources: () => [],
}

export { Swap, SwapWith, Activate, ActivateX, Deactivate }
