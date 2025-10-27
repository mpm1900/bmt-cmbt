import type { ReactNode } from 'react'
import type { ActionQueueItem, DialogAction } from './action'
import type { DeltaPositionContext, DeltaQueueItem } from './delta'

type DialogCheck<T> = {
  chance: number
  success?: Array<DeltaQueueItem<T, DeltaPositionContext>>
  failure?: Array<DeltaQueueItem<T, DeltaPositionContext>>
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
  messages: (state: T) => Array<DialogMessage>
  options: (state: T) => Array<DialogOption<T, A>>
}

type Dialog<T, A> = {
  ID: string
  nodes: Array<DialogNode<T, A>>
  startNodeID: string
  activeNodeID: string | undefined
}

export type { DialogCheck, DialogMessage, DialogOption, DialogNode, Dialog }
