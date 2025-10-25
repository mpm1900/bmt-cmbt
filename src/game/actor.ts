import { v4 } from 'uuid'
import type { SActor, SEffectItem } from './state'
import type { ChanceEvent, Damage, PowerDamage } from './types/damage'
import type { ActorState, ActorStats } from './types/actor'
import { chance } from '@/lib/chance'

function withState(actor: SActor, state: Partial<ActorState>): SActor {
  return {
    ...actor,
    state: {
      ...actor.state,
      ...state,
    },
  }
}

function withStats(actor: SActor, stats: Partial<ActorStats>): SActor {
  return {
    ...actor,
    stats: {
      ...actor.stats,
      ...stats,
    },
  }
}

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

function getSourceChance(
  success: number,
  critical: number,
  source: SActor
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

function getTargetChance(target: SActor): ChanceEvent {
  const evasionRoll = chance(target.stats.evasion)
  const targetEvent: ChanceEvent = newChanceEvent({
    success: evasionRoll[0],
    successRoll: evasionRoll[1],
    successThreshold: target.stats.evasion,
  })
  return targetEvent
}

function getDamageResult(
  source: SActor,
  target: SActor,
  damage: Damage
): number {
  if (damage.type === 'raw') {
    return damage.raw
  }

  if (damage.type === 'power') {
    const sourceStat = source.stats[damage.offenseStat]
    const targetStat = target.stats[damage.defenseStat]
    const ratio = sourceStat / targetStat
    const successModifier = damage.success ? 1 : 0
    const criticalModifier = damage.critical ? damage.criticalModifier : 1
    const evasionModifier = damage.evade ? 0 : 1
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

function withDamage(actor: SActor, damage: number, alive: 0 | 1): SActor {
  return withState(actor, {
    damage,
    alive,
  })
}

function withEffects(
  actor: SActor,
  effects: Array<SEffectItem>
): [SActor, Array<string>] {
  if (actor.modified) {
    console.error('already modified', actor, effects)
    return [actor, []]
  }

  const applied: Set<string> = new Set<string>()
  const modifiers = effects
    .flatMap((item) => {
      const { effect, context } = item
      const items = effect.modifiers(context).map((modifier) => ({
        ID: v4(),
        effect: effect,
        modifier,
        context,
      }))

      return items
    })
    .sort((a, b) => a.effect.priority - b.effect.priority)

  actor = modifiers.reduce(
    (next, item) => {
      const { modifier, context, effect } = item
      if (modifier.filter && !modifier.filter(next, context)) return next

      applied.add(effect.ID)
      return modifier.apply(next, context)
    },
    { ...actor }
  )

  actor.modified = true
  return [actor, Array.from(applied)]
}

function getStats(actor: SActor): ActorStats {
  const { accuracy, body, evasion, health, intelligence, reflexes, ...stats } =
    actor.stats

  const accuracyModifier = reflexes
  const evasionModifier = 0
  const healthModifier = body

  return {
    ...stats,
    accuracy: accuracy + accuracyModifier,
    body,
    evasion: evasion + evasionModifier,
    health: health + healthModifier,
    intelligence,
    reflexes,
  }
}

function getHealth(actor: SActor): [number, number] {
  const { health } = actor.stats
  const { damage } = actor.state

  return [health - damage, health]
}

export {
  withState,
  withStats,
  withDamage,
  newDamage,
  withChanceEvents,
  getSourceChance,
  getTargetChance,
  getDamageResult,
  withEffects,
  getStats,
  getHealth,
}
