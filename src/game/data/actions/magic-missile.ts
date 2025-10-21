import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

import { damageResolver, emptyResolver } from '@/game/resolvers'
import type { PowerDamage } from '@/game/types/damage'
import { chance } from '@/lib/chance'
import { newDamage, withCritical } from '@/game/actor'
import { isActive, mapTarget } from '@/game/access'

const MagicMissileDamage: PowerDamage = newDamage({
  offenseStat: 'intelligence',
  defenseStat: 'intelligence',
  element: 'shock',
  power: 10,
  criticalModifier: 1.5,
})
const MagicMissileAccuracy = 100
const MagicMissileCritChance = 10

const MagicMissile: SAction = {
  ID: v4(),
  name: 'Magic Missile',
  validate: () => true,
  targets: {
    unique: false,
    max: () => 5,
    get: (state, context) =>
      state.actors
        .filter((a) => a.ID !== context.sourceID && isActive(state, a.ID))
        .map((a) => mapTarget(a, 'position')),
    validate: (_state, context) =>
      context.positions.filter((id) => !!id).length === 5,
  },
  resolve: (_, context) => {
    return [
      context.targetIDs.map((targetID) => {
        if (!chance(MagicMissileAccuracy)[0]) {
          return emptyResolver(context)
        }
        return damageResolver(
          { ...context, targetIDs: [targetID] },
          withCritical(MagicMissileDamage, chance(MagicMissileCritChance)[0])
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
