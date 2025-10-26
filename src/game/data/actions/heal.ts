import { getAliveActiveActors, mapTarget } from '@/game/access'
import { withState } from '@/game/actor'
import { mutateActorResolver } from '@/game/resolvers'
import type { SDialogAction } from '@/game/state'
import { v4 } from 'uuid'

const Heal: SDialogAction = {
  ID: v4(),
  name: 'Heal',
  priority: 0,
  validate: (state, context) => getAliveActiveActors(state, context).length > 0,
  targets: {
    unique: true,
    max: () => 1,
    get: (state, _context) => state.actors.map((a) => mapTarget(a, 'targetID')),
    validate: (_state, context) => context.targetIDs.length === 1,
  },
  sources: (state, context) => getAliveActiveActors(state, context),
  resolve(_, context) {
    return [
      mutateActorResolver(context.targetIDs[0], context, (a) =>
        withState(a, { damage: Math.max(a.state.damage - 20, 0) })
      ),
    ]
  },
}

export { Heal }
