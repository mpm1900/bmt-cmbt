import type { ContextItem, DeltaResolver } from './delta'
import { type Queue } from './queue'

type Trigger<T> = DeltaResolver<T> & {
  type: 'onTurnStart' | 'onDamage'
}

type TriggerQueueItem<T> = ContextItem & {
  trigger: Trigger<T>
}

type TriggerQueue<T> = Queue<TriggerQueueItem<T>>

export type { Trigger, TriggerQueueItem, TriggerQueue }
