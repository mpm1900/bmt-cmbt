import { v4 } from 'uuid'
import type {
  Actor,
  ActorState,
  ActorStats,
  ModifiedActor,
} from '../types/actor'
import type { Delta, DeltaContext, DeltaQueueItem } from '../types/delta'
import type { EffectItem } from '../types/effect'
import type { Action } from '../types/action'
import { getDamageResult } from './damage'
import type { Damage, DamageResult } from '../types/damage'

function updateActor<T, A extends Actor<T> = Actor<T>>(
  actor: A,
  fn: (a: A) => Partial<A>
) {
  return {
    ...actor,
    ...fn(actor),
  }
}

function withState<T, A extends Actor<T> = Actor<T>>(
  actor: A,
  state: Partial<ActorState>
): A {
  return {
    ...actor,
    state: {
      ...actor.state,
      ...state,
    },
  }
}

function withStats<T, A extends Actor<T> = Actor<T>>(
  actor: A,
  stats: Partial<ActorStats>
): A {
  return {
    ...actor,
    stats: {
      ...actor.stats,
      ...stats,
    },
  }
}

function withCooldown<T, A extends Actor<T> = Actor<T>>(
  actor: A,
  action: Action<T, A>,
  state: T,
  context: DeltaContext
): A {
  return {
    ...actor,
    cooldowns: {
      ...actor.cooldowns,
      [action.ID]: action.cooldown(state, context),
    },
  }
}

function withDamage<T, A extends Actor<T> = Actor<T>>(
  actor: A,
  damage: number,
  alive: 0 | 1
): A {
  return withState<T, A>(actor, { damage: Math.max(damage, 0), alive })
}

function withHeal<T, A extends Actor<T> = Actor<T>>(actor: A, heal: number): A {
  const damage = Math.max(actor.state.damage - heal, 0)
  return withState<T, A>(actor, {
    damage,
  })
}

function computeDamage<T>(
  source: ModifiedActor<T> | undefined,
  target: ModifiedActor<T> | undefined,
  damage: Damage,
  cb?: (result: DamageResult) => void
): (a: Actor<T>) => Actor<T> {
  if ((damage.type === 'power' && !source) || !target) return (a) => a

  const result = getDamageResult(source, target, damage)
  cb?.(result)

  return (a) => {
    const newDamage = a.state.damage + result.damage
    return withDamage<T>(a, newDamage, newDamage < target.stats.health ? 1 : 0)
  }
}

function withModifier<T, A extends Actor<T> = Actor<T>>(
  actor: A,
  modifier: Delta<A>,
  context: DeltaContext,
  onSuccess?: () => void
): A {
  if (modifier.filter && !modifier.filter(actor, context)) return actor
  onSuccess?.()
  return modifier.apply(actor, context)
}

function withModifierItems<
  T,
  A extends Actor<T>,
  I extends DeltaQueueItem<A, DeltaContext> = DeltaQueueItem<A, DeltaContext>,
>(actor: A, items: Array<I>, onSuccess?: (item: I) => void): A {
  return items.reduce(
    (next, item) => {
      return withModifier<T, A>(next, item.delta, item.context, () =>
        onSuccess?.(item)
      )
    },
    { ...actor }
  )
}

function withEffects<T>(
  actor: Actor<T>,
  effects: Array<EffectItem<T, Actor<T>>>
): ModifiedActor<T> {
  if (actor.modified) {
    console.error('already modified', actor, effects)
    return actor as ModifiedActor<T>
  }

  effects = effects.filter((e) => e.effect.delay === 0)
  const parentEffects = effects.filter((e) => e.context.parentID === actor.ID)
  const applied = parentEffects.reduce(
    (acc, e) => {
      acc[e.effect.ID] = acc[e.effect.ID] || 0
      return acc
    },
    {} as { [key: string]: number }
  )
  const increment = (key: string) => {
    applied[key] = (applied[key] || 0) + 1
  }
  const modifiers = effects
    .flatMap((i) =>
      i.effect.modifiers(i.context).map((modifier) => ({
        ID: v4(),
        effect: i.effect,
        delta: modifier,
        context: i.context,
      }))
    )
    .sort((a, b) => a.delta.priority - b.delta.priority)

  actor = withModifierItems<T, Actor<T>, (typeof modifiers)[number]>(
    actor,
    modifiers,
    (item) => increment(item.effect.ID)
  )
  return {
    ...actor,
    modified: true,
    applied,
  }
}

function getHealth<T, A extends Actor<T> = Actor<T>>(
  actor: A
): [number, number] {
  const { health } = actor.stats
  const { damage } = actor.state

  return [health - damage, health]
}

function getStats<T, A extends Actor<T> = Actor<T>>(actor: A): ActorStats {
  const { accuracy, body, evasion, health, mind, reflexes, ...stats } =
    actor.stats

  const accuracyModifier = 0
  const evasionModifier = 0
  const healthModifier = body

  return {
    ...stats,
    accuracy: accuracy + accuracyModifier,
    body,
    evasion: evasion + evasionModifier,
    health: health + healthModifier,
    mind,
    reflexes,
  }
}

function decrementCooldowns<T, A extends Actor<T> = Actor<T>>(actor: A): A {
  return {
    ...actor,
    cooldowns: Object.keys(actor.cooldowns).reduce(
      (cooldowns, key) => {
        const value = actor.cooldowns[key] - 1
        if (value === 0) return cooldowns
        return {
          ...cooldowns,
          [key]: value,
        }
      },
      {} as typeof actor.cooldowns
    ),
  }
}

export {
  updateActor,
  withState,
  withStats,
  withCooldown,
  withDamage,
  withHeal,
  computeDamage,
  withModifierItems,
  withEffects,
  getHealth,
  getStats,
  decrementCooldowns,
}
