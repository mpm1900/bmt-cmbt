import { withState } from '@/game/actor'
import { mutateActorResolver } from '@/game/resolvers'
import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

const Heal: SAction = {
  ID: v4(),
  name: 'Heal',
  validate: (_state, context) => context.targetIDs.length === 1,
  maxTargetCount: () => 1,
  uniqueTargets: true,
  targets: (state, _context) => {
    return state.actors
  },
  resolve(_state, context) {
    return [
      mutateActorResolver(context.targetIDs[0], context, (a) =>
        withState(a, { damage: Math.max(a.state.damage - 20, 0) })
      ),
    ]
  },
}

export { Heal }
