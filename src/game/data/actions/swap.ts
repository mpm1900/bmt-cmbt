import { withState } from '@/game/actor'
import { mutateActorResolver } from '@/game/resolvers'
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
      state.actors.filter(
        (a) =>
          !a.state.active &&
          a.playerID ===
            state.actors.find((s) => s.ID === context.sourceID)?.playerID
      ),
  },
  resolve: (_, context) => {
    return [
      mutateActorResolver(context.sourceID, context, (a) =>
        withState(a, { active: 0 })
      ),
      context.targetIDs.map((targetID) =>
        mutateActorResolver(targetID, context, (a) =>
          withState(a, { active: 1 })
        )
      ),
    ]
  },
}

export { Swap }
