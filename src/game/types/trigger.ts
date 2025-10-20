import type { ContextItem, DeltaContext, DeltaResolver } from './delta'
import { type Queue } from './queue'

type Trigger<T> = DeltaResolver<T, DeltaContext, DeltaContext> & {
  type: 'onDamage' | 'onDeath' | 'onTurnStart' | 'onTurnEnd'
}

type TriggerQueueItem<T> = ContextItem<DeltaContext> & {
  trigger: Trigger<T>
}

type TriggerQueue<T> = Queue<TriggerQueueItem<T>>

export type { Trigger, TriggerQueueItem, TriggerQueue }
