import type { Action } from './action'
import type { DeltaPositionContext, DeltaQueueItem } from './delta'

type DialogCheck<T> = {
  chance: number
  success?: Array<DeltaQueueItem<T, DeltaPositionContext>>
  failure?: Array<DeltaQueueItem<T, DeltaPositionContext>>
}

type DialogMessage = {
  ID: string
  type: ''
  actorID: string | undefined
  text: string
}

type DialogOption<T, A> = {
  ID: string
  text: string
  icons: string
  action: Action<T, A>
  context: DeltaPositionContext
}

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

export type { DialogCheck, DialogMessage, DialogOption, DialogNode, Dialog }
