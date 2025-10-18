import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

import { damageResolver } from '@/game/resolvers'
import type { Damage } from '@/game/types/damage'

const MagicMissileDamage: Damage = {
  offenseStat: 'intelligence',
  defenseStat: 'intelligence',
  element: 'shock',
  power: 10,
}

const MagicMissile: SAction = {
  ID: v4(),
  name: 'Magic Missile',
  validate: (_state, context) =>
    context.targetIDs.filter((id) => !!id).length === 5,
  maxTargetCount: () => 5,
  uniqueTargets: false,
  targets: (state, context) =>
    state.actors.filter((a) => a.ID !== context.sourceID),
  resolve: (_, context) => {
    return [
      context.targetIDs.map((targetID) =>
        damageResolver(
          { ...context, targetIDs: [targetID] },
          MagicMissileDamage
        )
      ),
    ]
  },
}

export { MagicMissile, MagicMissileDamage }
