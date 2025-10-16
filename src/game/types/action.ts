import type { ContextItem, DeltaContext, DeltaResolver } from './delta'
import type { Queue } from './queue'

type Action<T, A> = DeltaResolver<T> & {
  name: string
  targets: (state: T, context: DeltaContext) => Array<A>
  maxTargetCount: (state: T, context: DeltaContext) => number
  uniqueTargets?: boolean
}

type ActionQueueItem<T, A> = ContextItem & {
  action: Action<T, A>
}

type ActionQueue<T, A> = Queue<ActionQueueItem<T, A>>

export type { Action, ActionQueueItem, ActionQueue }
