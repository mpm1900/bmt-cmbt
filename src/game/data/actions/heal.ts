import { mapTarget } from '@/game/access'
import { withState } from '@/game/actor'
import { mutateActorResolver } from '@/game/resolvers'
import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

const Heal: SAction = {
  ID: v4(),
  name: 'Heal',
  validate: (_state, context) => context.positions.length === 1,
  targets: {
    unique: true,
    max: () => 1,
    get: (state, _context) => state.actors.map((a) => mapTarget(a, 'position')),
  },
  resolve(_, context) {
    return [
      mutateActorResolver(context.targetIDs[0], context, (a) =>
        withState(a, { damage: Math.max(a.state.damage - 20, 0) })
      ),
    ]
  },
}

export { Heal }
