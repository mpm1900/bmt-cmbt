import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

import { damageResolver } from '@/game/resolvers'

const SliceDamage = 10

export const MagicMissile: SAction = {
  ID: v4(),
  name: 'Magic Missile',
  validate: (_state, _context) => _context.targetIDs.length === 5,
  maxTargetCount: () => 5,
  uniqueTargets: false,
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
