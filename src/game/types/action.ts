import type { ContextItem, DeltaContext, DeltaResolver } from './delta'
import type { Queue } from './queue'

type ActionTargetGenerator<T, A> = {
  get: (state: T, context: DeltaContext) => Array<A>
  max: (state: T, context: DeltaContext) => number
  unique: boolean
}

type Action<T, A> = DeltaResolver<T> & {
  name: string
  targets: ActionTargetGenerator<T, A>
}

type ActionQueueItem<T, A> = ContextItem & {
  action: Action<T, A>
}

type ActionQueue<T, A> = Queue<ActionQueueItem<T, A>>

export type { Action, ActionTargetGenerator, ActionQueueItem, ActionQueue }
