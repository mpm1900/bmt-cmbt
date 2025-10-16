import type { Action } from './action'

type ActorState = Record<string, number>

type Actor<T> = {
  ID: string
  name: string
  modified: boolean
  actions: Array<Action<T, Actor<T>>>
  stats: Record<string, number>
  state: ActorState
}

export type { Actor, ActorState }
