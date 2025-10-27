import type { ReactNode } from 'react'
import type { ActionQueueItem, DialogAction } from './action'
import type {
  DeltaContext,
  DeltaPositionContext,
  DeltaQueueItem,
} from './delta'

type DialogCheck<T> = {
  chance: number
  success?: (roll: number) => Array<DeltaQueueItem<T, DeltaContext>>
  failure?: (roll: number) => Array<DeltaQueueItem<T, DeltaContext>>
}

type DialogMessage = {
  ID: string
  actorID: string | undefined
  text: ReactNode
}

type DialogOption<T, A> = ActionQueueItem<T, A, DialogAction<T, A>> & {
  text: ReactNode
  icons: ReactNode
  context: DeltaPositionContext
}

type DialogNode<T, A> = {
  ID: string
  checks: (state: T, context: DeltaContext) => Array<DialogCheck<T>>
  messages: (state: T, context: DeltaContext) => Array<DialogMessage>
  options: (
    state: T,
    context: DeltaPositionContext
  ) => Array<DialogOption<T, A>>
}

type Dialog<T, A> = {
  ID: string
  nodes: Array<DialogNode<T, A>>
  startNodeID: string
  activeNodeID: string | undefined
}

export type { DialogCheck, DialogMessage, DialogOption, DialogNode, Dialog }
