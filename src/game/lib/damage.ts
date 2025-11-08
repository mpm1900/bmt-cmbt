import { chance } from '@/lib/chance'
import type { Actor } from '../types/actor'
import type { ChanceEvent, Damage, PowerDamage } from '../types/damage'
import { getHealth } from './actor'

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
  source: Actor<T>,
  options: {
    successThreshold: number
    criticalThreshold: number
  }
): ChanceEvent {
  const successThreshold = options.successThreshold + source.stats.accuracy
  const successRoll = chance(successThreshold)
  const criticalThreshold = options.criticalThreshold + 0 // TODO: critical stat
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

function getTargetChance<T>(
  target: Actor<T>,
  options: { ignoreEvade?: boolean } = {}
): ChanceEvent {
  const evasionRoll = options.ignoreEvade
    ? ([false, 0] as const)
    : chance(target.stats.evasion)
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
  if (target.state.protected && !damage.bypassProtected) {
    return 0
  }

  if (damage.type === 'raw') {
    return damage.raw
  }

  if (damage.type === 'percentage') {
    const [_, maxHealth] = getHealth<T>(target)
    return Math.round(maxHealth * damage.percentage)
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
