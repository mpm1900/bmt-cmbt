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

const SprayNPrayDamage: PowerDamage = newDamage({
  offenseStat: 'reflexes',
  defenseStat: 'reflexes',
  element: 'physical',
  power: 8,
  criticalModifier: 1.5,
})
const SprayNPrayAccuracy = 50
const SPrayNPrayCount = 8
const SprayNPrayCritChance = 10

const SprayNPray: SAction = {
  ID: v4(),
  name: 'Magic Missile',
  validate: () => true,
  targets: {
    unique: false,
    max: () => SPrayNPrayCount,
    get: (state, context) =>
      state.actors
        .filter((a) => a.ID !== context.sourceID && isActive(state, a.ID))
        .map((a) => mapTarget(a, 'position')),
    validate: (_state, context) =>
      context.positions.filter((id) => !!id).length === SPrayNPrayCount,
  },
  resolve: (state, context) => {
    return [
      context.targetIDs.map((targetID) => {
        const source = getSourceChance(
          SprayNPrayAccuracy,
          0,
          getActor(state, context.sourceID)!
        )
        const target = getTargetChance(getActor(state, targetID)!)
        const damage = withChanceEvents(SprayNPrayDamage, source, target)
        const ctx = { ...context, targetIDs: [targetID] }
        return damagesResolver(ctx, [damage], [ctx])
      }),
    ]
  },
}

export {
  SprayNPray,
  SprayNPrayDamage,
  SprayNPrayAccuracy,
  SprayNPrayCritChance,
  SPrayNPrayCount,
}
