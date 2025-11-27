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
import { getUniqueCombinations } from '@/lib/get-unique-combinations'
import { v4 } from 'uuid'

const Swap: SDialogAction = {
  ID: v4(),
  name: 'Swap Actors',
  priority: 5,
  cooldown: () => 0,
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
        activateActorResolver(context.playerID, targetID, context, 1)
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
  name: 'Choose Fighters',
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
      activateActorResolver(context.playerID, id, context, 0)
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
    ai: {
      compute: Activate.ai!.compute,
      generateContexts: (s, c, a) => {
        const actors = a.targets.get(s, c)
        return getUniqueCombinations(actors, x).map((targets) => ({
          ...c,
          targetIDs: targets.map((t) => t.target.ID),
        }))
      },
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
      deactivateActorResolver(
        context.playerID,
        context.targetIDs[0],
        context,
        0
      ),
    ]
  },
  sources: () => [],
}

export { Swap, SwapWith, Activate, ActivateX, Deactivate }
