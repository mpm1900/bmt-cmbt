import type { ReactNode } from 'react'
import type { ActionQueueItem } from './action'
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

type StaticDialogOption<T, A> = ActionQueueItem<T, A> & {
  type: 'static'
  text: ReactNode
  icons: ReactNode
}

type DynamicDialogOptionContext = DeltaPositionContext & {
  text: string
}

type DynamicDialogOption<T, A> = ActionQueueItem<T, A> & {
  type: 'dynamic'
  text: ReactNode
  icons: ReactNode
  options: Array<DynamicDialogOptionContext>
}

type DialogOption<T, A> = StaticDialogOption<T, A> | DynamicDialogOption<T, A>

type DialogNode<T, A> = {
  ID: string
  status: 'pre' | 'main' | 'post'
  pre: (state: T, context: DeltaPositionContext) => Array<DialogCheck<T>>
  messages: (state: T, context: DeltaPositionContext) => Array<DialogMessage>
  options: (
    state: T,
    context: DeltaPositionContext
  ) => Array<DialogOption<T, A>>
  post: (state: T, context: DeltaPositionContext) => Array<DialogCheck<T>>
}

type Dialog<T, A> = {
  ID: string
  nodes: Array<DialogNode<T, A>>
  activeNodeID: string | undefined
}

export type {
  DialogCheck,
  DialogMessage,
  DynamicDialogOption,
  StaticDialogOption,
  DialogOption,
  DialogNode,
  Dialog,
}
