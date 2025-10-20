import type { DeltaContext, DeltaPositionContext, DeltaResolver } from './delta'
import type { Queue } from './queue'

type ActionTarget<A> = {
  ID: string
  type: 'position' | 'targetID'
  target: A
}

type ActionTargetGenerator<T, A> = {
  get: (state: T, context: DeltaPositionContext) => Array<ActionTarget<A>>
  max: (state: T, context: DeltaPositionContext) => number
  unique: boolean
}

type Action<T, A> = DeltaResolver<T, DeltaPositionContext, DeltaContext> & {
  name: string
  targets: ActionTargetGenerator<T, A>
}

type ActionQueueItem<T, A> = {
  ID: string
  context: DeltaPositionContext
  action: Action<T, A>
}

type PromptQueueItem<T, A> = ActionQueueItem<T, A> & {
  context: DeltaPositionContext
}

type ActionQueue<T, A> = Queue<ActionQueueItem<T, A>>
type PromptQueue<T, A> = Queue<PromptQueueItem<T, A>>

export type {
  Action,
  ActionTarget,
  ActionTargetGenerator,
  ActionQueueItem,
  PromptQueueItem,
  ActionQueue,
  PromptQueue,
}
