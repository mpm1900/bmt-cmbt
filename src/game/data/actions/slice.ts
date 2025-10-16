import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

import { damageResolver } from '@/game/resolvers'

const SliceDamage = 10

export const Slice: SAction = {
  ID: v4(),
  name: 'Slice',
  validate: (_state, _context) => true,
  maxTargetCount: () => 1,
  targets: (state, context) =>
    state.actors.filter((a) => a.ID !== context.sourceID),
  resolve: (_, context) => {
    return [
      context.targetIDs.map((targetID) =>
        damageResolver({ ...context, targetIDs: [targetID] }, SliceDamage)
      ),
    ]
  },
}
