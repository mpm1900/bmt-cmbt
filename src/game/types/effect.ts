import type { ContextItem, DeltaContext } from './delta'
import type { Modifier } from './modifier'
import type { Trigger } from './trigger'

type Effect<T, A> = {
  ID: string
  modifiers: (context: DeltaContext) => Array<Modifier<A>>
  triggers: (context: DeltaContext) => Array<Trigger<T>>
}

type EffectItem<T, A> = ContextItem & {
  effect: Effect<T, A>
}

export type { Effect, EffectItem }
