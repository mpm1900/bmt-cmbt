import { chance } from '@/lib/chance'
import type { Actor } from '../types/actor'
import type { ChanceEvent, Damage, PowerDamage } from '../types/damage'

function newDamage(
  damage: Partial<PowerDamage> &
    Pick<PowerDamage, 'offenseStat' | 'defenseStat' | 'power'>
): PowerDamage {
  return {
    type: 'power',
    success: false,
    evade: false,
    critical: false,
    criticalModifier: 1,
    element: 'physical',
    ...damage,
  }
}

function newChanceEvent(chanceEvent: Partial<ChanceEvent>): ChanceEvent {
  return {
    success: false,
    successRoll: 0,
    successThreshold: 0,
    critical: false,
    criticalRoll: 0,
    criticalThreshold: 0,
    ...chanceEvent,
  }
}

function withChanceEvents(
  damage: PowerDamage,
  sourceEvent: ChanceEvent,
  evasionEvent: ChanceEvent
): PowerDamage {
  return {
    ...damage,
    success: sourceEvent.success,
    evade: evasionEvent.success,
    critical: sourceEvent.success && sourceEvent.critical,
  }
}

function getSourceChance<T>(
  success: number,
  critical: number,
  source: Actor<T>
): ChanceEvent {
  const successThreshold = success + source.stats.accuracy
  const successRoll = chance(successThreshold)
  const criticalThreshold = critical + 0 // TODO: critical stat
  const criticalRoll = chance(criticalThreshold)
  const sourceEvent: ChanceEvent = newChanceEvent({
    success: successRoll[0],
    successRoll: successRoll[1],
    successThreshold,
    critical: criticalRoll[0],
    criticalRoll: criticalRoll[1],
    criticalThreshold,
  })

  return sourceEvent
}

function getTargetChance<T>(target: Actor<T>): ChanceEvent {
  const evasionRoll = chance(target.stats.evasion)
  const targetEvent: ChanceEvent = newChanceEvent({
    success: evasionRoll[0],
    successRoll: evasionRoll[1],
    successThreshold: target.stats.evasion,
  })
  return targetEvent
}

function getDamageResult<T>(
  source: Actor<T> | undefined,
  target: Actor<T>,
  damage: Damage
): number {
  if (damage.type === 'raw') {
    return damage.raw
  }

  if (damage.type === 'power') {
    if (!source) return 0
    const sourceStat = source.stats[damage.offenseStat]
    const targetStat = target.stats[damage.defenseStat]
    const ratio = sourceStat / targetStat
    const successModifier = damage.success ? 1 : 0
    const criticalModifier = damage.critical ? damage.criticalModifier : 1
    const evasionModifier = damage.evade && !damage.critical ? 0 : 1 // can't evade crits
    const damageAmount = Math.round(
      damage.power *
        ratio *
        successModifier *
        criticalModifier *
        evasionModifier
    )
    return damageAmount
  }

  return 0
}

export {
  newDamage,
  getSourceChance,
  getTargetChance,
  getDamageResult,
  withChanceEvents,
}
