import type {
  ContextItem,
  DeltaContext,
  DeltaPlayerContext,
  DeltaResolver,
} from './delta'
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

type PromptQueueItem<T, A> = ActionQueueItem<T, A> & {
  context: DeltaPlayerContext
}

type ActionQueue<T, A> = Queue<ActionQueueItem<T, A>>
type PromptQueue<T, A> = Queue<PromptQueueItem<T, A>>

export type {
  Action,
  ActionTargetGenerator,
  ActionQueueItem,
  PromptQueueItem,
  ActionQueue,
  PromptQueue,
}
