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

type DialogOptionContext = DeltaPositionContext & {
  text: string
}

type SingleTargetDialogOption<T, A> = ActionQueueItem<T, A> & {
  type: 'single-target'
  text: ReactNode
  icons: ReactNode
  sourceOptions: Array<DialogOptionContext>
  targetOptions: Array<DialogOptionContext>
}

type DialogOption<T, A> =
  | NoTargetDialogOption<T, A>
  | SingleTargetDialogOption<T, A>

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
  startNodeID: string
  activeNodeID: string | undefined
}

export type {
  DialogCheck,
  DialogMessage,
  DialogOptionContext,
  SingleTargetDialogOption,
  NoTargetDialogOption,
  DialogOption,
  DialogNode,
  Dialog,
}
