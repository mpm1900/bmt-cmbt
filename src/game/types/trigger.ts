import type { ContextItem, DeltaContext, DeltaResolver } from './delta'
import { type Queue } from './queue'

type Trigger<T> = DeltaResolver<T, DeltaContext, DeltaContext> & {
  priority: number
  type:
    | 'on-actor-activate'
    | 'on-actor-deactivate'
    | 'on-combat-start'
    | 'on-damage-dealt'
    | 'on-damage'
    | 'on-death'
    | 'on-turn-start'
    | 'on-turn-end'
}

type TriggerQueueItem<T> = ContextItem<DeltaContext> & {
  trigger: Trigger<T>
}

type TriggerQueue<T> = Queue<TriggerQueueItem<T>>

export type { Trigger, DeltaContext, TriggerQueueItem, TriggerQueue }
