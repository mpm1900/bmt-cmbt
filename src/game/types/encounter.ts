import type { ReactNode } from 'react'
import type { ActionQueueItem, DialogAction } from './action'
import type { DeltaContext, DeltaQueueItem } from './delta'
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
  context: DeltaContext
}

type OptionsNode<T, A> = {
  ID: string
  type: 'options'
  checks: (state: T, context: DeltaContext) => Array<DialogCheck<T>>
  messages: (state: T, context: DeltaContext) => Array<Message>
  options: (state: T, context: DeltaContext) => Array<DialogOption<T, A>>
}

type ShopNode<T, A> = {
  ID: string
  type: 'shop'
  messages: (state: T, context: DeltaContext) => Array<Message>
  items: Array<Item<T, A>>
  credits: number
  options: (state: T, context: DeltaContext) => Array<DialogOption<T, A>>
}

type DialogNode<T, A> = OptionsNode<T, A> | ShopNode<T, A>

type Encounter<T, A> = {
  ID: string
  name: string
  persist: boolean
  nodes: Array<DialogNode<T, A> | ShopNode<T, A>>
  startNodeID: string
}

export type {
  DialogCheck,
  DialogOption,
  OptionsNode,
  ShopNode,
  DialogNode,
  Encounter,
}
