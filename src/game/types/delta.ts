import type { Position } from './player'
import { type Queue } from './queue'

type Delta<T> = {
  apply: (state: T, context: DeltaContext) => T
  filter?: (state: T, context: DeltaContext) => boolean
}

type DeltaContext = {
  playerID: string
  sourceID: string
  parentID: string
  targetIDs: Array<string | undefined>
  positions: Array<Position>
}

type ContextItem<C> = {
  ID: string
  context: C
}

type DeltaQueueItem<T, C> = ContextItem<C> & {
  delta: Delta<T>
}

type DeltaQueue<T, C> = Queue<DeltaQueueItem<T, C>>

type DeltaResolver<T, C1, C2> = {
  ID: string
  validate: (state: T, context: C1) => boolean
  resolve: (
    state: T,
    context: C2
  ) => Array<DeltaQueueItem<T, C2> | Array<DeltaQueueItem<T, C2>>>
}

export type {
  Delta,
  DeltaContext,
  ContextItem,
  DeltaQueueItem,
  DeltaQueue,
  DeltaResolver,
}
