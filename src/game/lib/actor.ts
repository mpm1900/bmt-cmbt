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

function updateActor<T>(
  actor: Actor<T>,
  fn: (a: Actor<T>) => Partial<Actor<T>>
) {
  return {
    ...actor,
    ...fn(actor),
  }
}

function withState<T>(
  actor: Actor<T>,
  state: Partial<ActorState>
): ReturnType<typeof updateActor<T>> {
  return updateActor<T>(actor, (a) => ({
    state: {
      ...a.state,
      ...state,
    },
  }))
}

function withStats<T>(actor: Actor<T>, stats: Partial<ActorStats>): Actor<T> {
  return updateActor<T>(actor, (a) => ({
    stats: {
      ...a.stats,
      ...stats,
    },
  }))
}

function withCooldown<T>(
  actor: Actor<T>,
  action: Action<T, Actor<T>>,
  state: T,
  context: DeltaContext
): Actor<T> {
  return updateActor<T>(actor, (a) => ({
    cooldowns: {
      ...a.cooldowns,
      [action.ID]: action.cooldown(state, context),
    },
  }))
}

function withDamage<T>(
  actor: Actor<T>,
  damage: number,
  alive: 0 | 1
): Actor<T> {
  return withState<T>(actor, { damage: Math.max(damage, 0), alive })
}

function withHeal<T>(actor: Actor<T>, heal: number): Actor<T> {
  const damage = Math.max(actor.state.damage - heal, 0)
  return withState<T>(actor, {
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
  const { ...stats } = actor.stats

  return {
    ...stats,
  }
}

function decrementCooldowns<T, A extends Actor<T> = Actor<T>>(actor: A): A {
  return {
    ...actor,
    cooldowns: Object.keys(actor.cooldowns).reduce(
      (cooldowns, key) => {
        const value = actor.cooldowns[key] - 1
        if (value <= 0) return cooldowns
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
