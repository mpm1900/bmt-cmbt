import { v4 } from 'uuid'
import type { SActor, SEffectItem } from './state'
import type { Damage, PowerDamage } from './types/damage'
import type { ActorState, ActorStats } from './types/actor'

function getHealth(actor: SActor): number {
  return actor.stats.body
}

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

function withCritical(damage: PowerDamage, critical: boolean): PowerDamage {
  return {
    ...damage,
    critical,
  }
}

function getDamageAmount(
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
    const criticalModifier = damage.critical ? damage.criticalModifier : 1
    const damageAmount = damage.power * ratio * criticalModifier
    return damageAmount
  }

  return 0
}

function withDamage(actor: SActor, damage: number): SActor {
  return withState(actor, { damage, alive: getHealth(actor) > damage ? 1 : 0 })
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
  const evasionModifier = reflexes
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

export {
  getHealth,
  withState,
  withStats,
  withDamage,
  withCritical,
  getDamageAmount,
  withEffects,
  getStats,
}
