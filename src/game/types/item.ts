import type { Action } from './action'
import type { Effect } from './effect'

type Item<T, A> = {
  ID: string
  name: string
  value: number
  consumable: Action<T, A> | undefined
  use: Action<T, A> | undefined
  effect: Effect<T, A> | undefined
  actions: Array<Action<T, A>> | undefined
}

export type { Item }
