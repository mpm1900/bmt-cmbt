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
  validate: (state: T, context: DeltaPositionContext) => boolean
  unique: boolean
}

type ActionAI<T, A> = {
  generateContexts: (
    state: T,
    context: DeltaPositionContext,
    action: Action<T, A>
  ) => Array<DeltaPositionContext>
  compute: (state: T, context: DeltaPositionContext) => number
}

type Action<T, A> = DeltaResolver<T, DeltaPositionContext, DeltaContext> & {
  name: string
  priority: number
  targets: ActionTargetGenerator<T, A>
  ai?: ActionAI<T, A>
}

type DialogAction<T, A> = Action<T, A> & {
  sources: (state: T, context: DeltaPositionContext) => Array<A>
}

type ActionQueueItem<T, A, N extends Action<T, A> = Action<T, A>> = {
  ID: string
  context: DeltaPositionContext
  action: N
}

type PromptQueueItem<T, A> = ActionQueueItem<T, A> & {
  context: DeltaPositionContext
}

type ActionQueue<T, A> = Queue<ActionQueueItem<T, A>>
type PromptQueue<T, A> = Queue<PromptQueueItem<T, A>>

export type {
  Action,
  DialogAction,
  ActionTarget,
  ActionTargetGenerator,
  ActionQueueItem,
  PromptQueueItem,
  ActionQueue,
  PromptQueue,
}
