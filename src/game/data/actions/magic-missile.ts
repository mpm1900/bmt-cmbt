import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

import { damagesResolver } from '@/game/resolvers'
import type { PowerDamage } from '@/game/types/damage'
import {
  getSourceChance,
  getTargetChance,
  newDamage,
  withChanceEvents,
} from '@/game/actor'
import { getActor, isActive, mapTarget } from '@/game/access'

const MagicMissileDamage: PowerDamage = newDamage({
  offenseStat: 'intelligence',
  defenseStat: 'intelligence',
  element: 'shock',
  power: 10,
  criticalModifier: 1.5,
})
const MagicMissileAccuracy = 50
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
  resolve: (state, context) => {
    return [
      context.targetIDs.map((targetID) => {
        const source = getSourceChance(
          MagicMissileAccuracy,
          0,
          getActor(state, context.sourceID)!
        )
        const target = getTargetChance(getActor(state, targetID)!)
        const damage = withChanceEvents(MagicMissileDamage, source, target)
        const ctx = { ...context, targetIDs: [targetID] }
        return damagesResolver(ctx, [damage], [ctx])
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
