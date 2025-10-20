import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

import { damageResolver, emptyResolver } from '@/game/resolvers'
import type { PowerDamage } from '@/game/types/damage'
import { chance } from '@/lib/chance'
import { withCritical } from '@/game/actor'
import { mapTarget } from '@/game/access'

const MagicMissileDamage: PowerDamage = {
  type: 'power',
  offenseStat: 'intelligence',
  defenseStat: 'intelligence',
  element: 'shock',
  power: 10,
  criticalModifier: 1.5,
}
const MagicMissileAccuracy = 100
const MagicMissileCritChance = 10

const MagicMissile: SAction = {
  ID: v4(),
  name: 'Magic Missile',
  validate: (_state, context) =>
    context.positions.filter((id) => !!id).length === 5,
  targets: {
    unique: false,
    max: () => 5,
    get: (state, context) =>
      state.actors
        .filter((a) => a.ID !== context.sourceID)
        .map((a) => mapTarget(a, 'position')),
  },
  resolve: (_, context) => {
    return [
      context.targetIDs.map((targetID) => {
        if (!chance(MagicMissileAccuracy)) {
          return emptyResolver(context)
        }
        return damageResolver(
          { ...context, targetIDs: [targetID] },
          withCritical(MagicMissileDamage, chance(MagicMissileCritChance))
        )
      }),
    ]
  },
}

export {
  MagicMissile,
  MagicMissileDamage,
  MagicMissileAccuracy,
  MagicMissileCritChance,
}
