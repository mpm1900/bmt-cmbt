import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

import { damageResolver, emptyResolver } from '@/game/resolvers'
import type { PowerDamage } from '@/game/types/damage'
import { chance } from '@/lib/chance'

const MagicMissileDamage: PowerDamage = {
  type: 'power',
  offenseStat: 'intelligence',
  defenseStat: 'intelligence',
  element: 'shock',
  power: 10,
}
const MagicMissileAccuracy = 50

const MagicMissile: SAction = {
  ID: v4(),
  name: 'Magic Missile',
  validate: (_state, context) =>
    context.targetIDs.filter((id) => !!id).length === 5,
  targets: {
    unique: false,
    max: () => 5,
    get: (state, context) =>
      state.actors.filter((a) => a.ID !== context.sourceID),
  },
  resolve: (_, context) => {
    return [
      context.targetIDs.map((targetID) => {
        if (!chance(MagicMissileAccuracy)) {
          return emptyResolver(context)
        }
        return damageResolver(
          { ...context, targetIDs: [targetID] },
          MagicMissileDamage
        )
      }),
    ]
  },
}

export { MagicMissile, MagicMissileDamage }
