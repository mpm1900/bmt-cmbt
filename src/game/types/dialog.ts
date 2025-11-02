import type { ReactNode } from 'react'
import type { ActionQueueItem, DialogAction } from './action'
import type {
  DeltaContext,
  DeltaPositionContext,
  DeltaQueueItem,
} from './delta'
import type { Message } from './message'
import type { Item } from './item'

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

type OptionsNode<T, A, S extends Object = {}> = {
  ID: string
  type: 'options'
  checks: (state: T, context: DeltaContext) => Array<DialogCheck<T>>
  messages: (state: T, context: DeltaContext) => Array<Message>
  options: (
    state: T,
    context: DeltaPositionContext
  ) => Array<DialogOption<T, A>>
  state: S
}

type ShopNode<T, A, S extends Object = {}> = {
  ID: string
  type: 'shop'
  messages: (state: T, context: DeltaContext) => Array<Message>
  items: Array<Item<T, A>>
  options: (
    state: T,
    context: DeltaPositionContext
  ) => Array<DialogOption<T, A>>
  state: S
}

type DialogNode<T, A, S extends Object = {}> =
  | OptionsNode<T, A, S>
  | ShopNode<T, A, S>

type Dialog<T, A> = {
  ID: string
  nodes: Array<DialogNode<T, A> | ShopNode<T, A>>
  startNodeID: string
  activeNodeID: string | undefined
  nodeCounts: { [nodeID: string]: number }
  nodeHistory: Array<string>
}

export type {
  DialogCheck,
  DialogOption,
  OptionsNode,
  ShopNode,
  DialogNode,
  Dialog,
}
