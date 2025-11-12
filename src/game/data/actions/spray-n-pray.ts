import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

import { damagesResolver } from '@/game/resolvers'
import type { PowerDamage } from '@/game/types/damage'
import { getActor, isActive, mapTarget } from '@/game/access'
import {
  getSourceChance,
  getTargetChance,
  newDamage,
  withChanceEvents,
} from '@/game/lib/damage'

const SprayNPrayDamage: PowerDamage = newDamage({
  offenseStat: 'reflexes',
  defenseStat: 'body',
  element: 'physical',
  power: 7,
  criticalModifier: 1.5,
})
const SprayNPrayAccuracy = 77
const SPrayNPrayCount = 7
const SprayNPrayCritChance = 7
const SprayNPrayCooldown = 2

const SprayNPray: SAction = {
  ID: v4(),
  name: "Spray 'n Pray",
  priority: 0,
  cooldown: () => SprayNPrayCooldown,
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
    const targetIDs = context.targetIDs.filter(Boolean)
    return [
      targetIDs.map((targetID) => {
        const source = getSourceChance(getActor(state, context.sourceID)!, {
          successThreshold: SprayNPrayAccuracy,
          criticalThreshold: SprayNPrayCritChance,
        })
        const target = getTargetChance(getActor(state, targetID)!)
        const damage = withChanceEvents(SprayNPrayDamage, source, target)
        const ctx = { ...context, targetIDs: [targetID] }
        return damagesResolver(ctx, [damage], [ctx], 0)
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
  SprayNPrayCooldown,
}
