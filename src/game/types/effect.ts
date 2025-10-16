import type { ContextItem, DeltaContext, DeltaQueueItem } from './delta'
import type { TriggerQueueItem } from './trigger'

type EffectModifier<A> = DeltaQueueItem<A> & {
  delay: number
  duration: number | undefined
  priority: number
}

type Effect<T, A> = {
  ID: string
  modifiers: (context: DeltaContext) => Array<EffectModifier<A>>
  triggers: (context: DeltaContext) => Array<TriggerQueueItem<T>>
}

type EffectItem<T, A> = ContextItem & {
  effect: Effect<T, A>
}

export type { EffectModifier, Effect, EffectItem }
