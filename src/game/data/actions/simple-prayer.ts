import { getActor, getAliveActiveActorsRaw, mapTarget } from '@/game/access'
import { resolveAction } from '@/game/action'
import {
  getSourceChance,
  getTargetChance,
  newDamage,
  withChanceEvents,
} from '@/game/lib/damage'
import { damagesResolver, healActorResolver } from '@/game/resolvers'
import type { SAction } from '@/game/state'
import type { PowerDamage } from '@/game/types/damage'
import { v4 } from 'uuid'

const SimplePrayerAccuracy = 100
const SimplePrayerDamage: PowerDamage = newDamage({
  offenseStat: 'faith',
  defenseStat: 'faith',
  element: 'fire',
  power: 20,
  criticalModifier: 1,
  recoil: 0,
  lifesteal: 0,
})
const SimplePrayerHealing = 10

const SimplePrayer: SAction = {
  ID: v4(),
  name: 'Heal',
  priority: 0,
  cooldown: () => 0,
  validate: () => true,
  targets: {
    unique: true,
    max: () => 1,
    get: (state, _context) =>
      getAliveActiveActorsRaw(state).map((a) => mapTarget(a, 'position')),
    validate: (_state, context) => context.positions.length === 1,
  },
  resolve(state, context) {
    return resolveAction(state, context, {
      costs: [],
      onSuccess: (mutations) => {
        const source = getActor(state, context.sourceID)!
        return mutations.concat(
          context.targetIDs.flatMap((targetID) => {
            const target = getActor(state, targetID)!
            if (target.playerID === source.playerID) {
              return [
                ...mutations,
                healActorResolver(targetID, context, SimplePrayerHealing),
              ]
            }

            const sChance = getSourceChance(source, {
              successThreshold: SimplePrayerAccuracy,
              criticalThreshold: 0,
            })

            const tChance = getTargetChance(target)
            const damage = withChanceEvents(
              SimplePrayerDamage,
              sChance,
              tChance
            )
            return damagesResolver(
              context,
              [damage],
              [
                {
                  ...context,
                  targetIDs: [targetID],
                },
              ]
            )
          })
        )
      },
      onError: (mutations) => mutations,
    })
  },
}

export {
  SimplePrayer,
  SimplePrayerAccuracy,
  SimplePrayerDamage,
  SimplePrayerHealing,
}
