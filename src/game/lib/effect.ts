import type { Actor } from '../types/actor'
import type { Effect, EffectItem } from '../types/effect'

function decrementEffect<T, A = Actor<T>>(effect: Effect<T, A>): Effect<T, A> {
  return {
    ...effect,
    duration: effect.duration === undefined ? undefined : effect.duration - 1,
    delay: effect.delay > 0 ? effect.delay - 1 : effect.delay,
  }
}

function decrementEffectItem<T, A = Actor<T>>(
  effectItem: EffectItem<T, A>
): EffectItem<T, A> {
  return {
    ...effectItem,
    effect: decrementEffect(effectItem.effect),
  }
}

export { decrementEffect, decrementEffectItem }
