import type { DeltaContext, DeltaResolver } from './delta'
import type { Queue } from './queue'

type ActionTarget<A> = {
  ID: string
  type: 'position' | 'targetID'
  target: A
}

type ActionTargetGenerator<T, A> = {
  get: (state: T, context: DeltaContext) => Array<ActionTarget<A>>
  max: (state: T, context: DeltaContext) => number
  validate: (state: T, context: DeltaContext) => boolean
  unique: boolean
}

type ActionAI<T, A> = {
  generateContexts: (
    state: T,
    context: DeltaContext,
    action: Action<T, A>
  ) => Array<DeltaContext>
  compute: (state: T, context: DeltaContext) => number | undefined
}

type Action<T, A> = DeltaResolver<T, DeltaContext, DeltaContext> & {
  name: string
  priority: number
  cooldown: (state: T, context: DeltaContext) => number
  targets: ActionTargetGenerator<T, A>
  ai?: ActionAI<T, A>
}

type DialogAction<T, A> = Action<T, A> & {
  sources: (state: T, context: DeltaContext) => Array<A>
}

type ActionQueueItem<T, A, N extends Action<T, A> = Action<T, A>> = {
  ID: string
  context: DeltaContext
  action: N
}

type PromptQueueItem<T, A> = ActionQueueItem<T, A> & {
  context: DeltaContext
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
