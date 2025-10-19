import { type Queue } from './queue'

type Delta<T> = {
  apply: (state: T, context: DeltaContext) => T
  filter?: (state: T, context: DeltaContext) => boolean
}

type DeltaContext = {
  sourceID: string
  targetIDs: string[]
}

type DeltaPlayerContext = DeltaContext & {
  playerID: string | undefined // undefined = computer/AI controlled, change type if that changes
}

type ContextItem = {
  ID: string
  context: DeltaContext
}

type DeltaQueueItem<T> = ContextItem & {
  delta: Delta<T>
}

type DeltaQueue<T> = Queue<DeltaQueueItem<T>>

type DeltaResolver<T> = {
  ID: string
  validate: (state: T, context: DeltaContext) => boolean
  resolve: (
    state: T,
    context: DeltaContext
  ) => Array<DeltaQueueItem<T> | Array<DeltaQueueItem<T>>>
}

export type {
  Delta,
  DeltaContext,
  DeltaPlayerContext,
  ContextItem,
  DeltaQueueItem,
  DeltaQueue,
  DeltaResolver,
}
