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

type NoTargetDialogOption<T, A> = ActionQueueItem<T, A> & {
  type: 'no-target'
  text: ReactNode
  icons: ReactNode
}

type DialogOptionContextMeta = {
  ID: string
  text: string
}
type DialogOptionContext = DeltaPositionContext & DialogOptionContextMeta

type SingleTargetDialogOption<T, A> = ActionQueueItem<T, A> & {
  type: 'single-target'
  text: ReactNode
  icons: ReactNode
  context: DialogOptionContext
  sourceOptions: Array<DialogOptionContext>
  targetOptions: Array<DialogOptionContext>
}

type DialogOption<T, A> =
  | NoTargetDialogOption<T, A>
  | SingleTargetDialogOption<T, A>

type DialogNode<T, A> = {
  ID: string
  status: 'pre' | 'main' | 'post'
  pre: (state: T) => Array<DialogCheck<T>>
  messages: (state: T) => Array<DialogMessage>
  options: (state: T) => Array<DialogOption<T, A>>
  post: (state: T) => Array<DialogCheck<T>>
}

type Dialog<T, A> = {
  ID: string
  nodes: Array<DialogNode<T, A>>
  startNodeID: string
  activeNodeID: string | undefined
}

export type {
  DialogCheck,
  DialogMessage,
  DialogOptionContextMeta,
  DialogOptionContext,
  SingleTargetDialogOption,
  NoTargetDialogOption,
  DialogOption,
  DialogNode,
  Dialog,
}
