import type { ReactNode } from 'react'
import type { ActionQueueItem, DialogAction } from './action'
import type {
  DeltaContext,
  DeltaPositionContext,
  DeltaQueueItem,
} from './delta'
import type { Message } from './message'

type DialogCheck<T> = {
  chance: number
  success?: (roll: number) => Array<DeltaQueueItem<T, DeltaContext>>
  failure?: (roll: number) => Array<DeltaQueueItem<T, DeltaContext>>
}

type DialogOption<T, A> = ActionQueueItem<T, A, DialogAction<T, A>> & {
  disable: 'hide' | 'disable'
  text: ReactNode
  icons: ReactNode
  context: DeltaPositionContext
}

type DialogNode<T, A, S extends Object = {}> = {
  ID: string
  checks: (state: T, context: DeltaContext) => Array<DialogCheck<T>>
  messages: (state: T, context: DeltaContext) => Array<Message>
  options: (
    state: T,
    context: DeltaPositionContext
  ) => Array<DialogOption<T, A>>
  state: S
}

type Dialog<T, A> = {
  ID: string
  nodes: Array<DialogNode<T, A>>
  startNodeID: string
  activeNodeID: string | undefined
}

export type { DialogCheck, DialogOption, DialogNode, Dialog }
