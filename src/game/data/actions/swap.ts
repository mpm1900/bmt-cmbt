import { getActor, mapTarget } from '@/game/access'
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
    get: (state, context) =>
      state.actors
        .filter(
          (a) =>
            !a.state.active &&
            a.playerID ===
              state.actors.find((s) => s.ID === context.sourceID)?.playerID
        )
        .map((a) => mapTarget(a, 'targetID')),
  },
  resolve: (state, context) => {
    const source = getActor(state, context.sourceID)!
    const playerContext = {
      ...context,
      playerID: source.playerID,
    }
    return [
      deactivateActorResolver(source.playerID, source.ID, playerContext),
      context.targetIDs.map((targetID) =>
        activateActorResolver(source.playerID, targetID, playerContext)
      ),
    ]
  },
}

export { Swap }
