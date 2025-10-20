import { getActor, isActive, mapTarget } from '@/game/access'
import {
  activateActorResolver,
  deactivateActorResolver,
} from '@/game/resolvers'
import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

const Swap: SAction = {
  ID: v4(),
  name: 'Swap',
  validate: (_state, context) => context.targetIDs.length === 1,
  targets: {
    unique: true,
    max: () => 1,
    get: (state, context) => {
      const source = state.actors.find((a) => a.ID === context.sourceID)
      return state.actors
        .filter((a) => !isActive(state, a.ID) && a.playerID == source?.playerID)
        .map((a) => mapTarget(a, 'targetID'))
    },
  },
  resolve: (state, context) => {
    const source = getActor(state, context.sourceID)
    if (!source) return []

    return [
      deactivateActorResolver(source.playerID, source.ID, context),
      context.targetIDs.map((targetID) =>
        activateActorResolver(source.playerID, targetID, context)
      ),
    ]
  },
}

export { Swap }
