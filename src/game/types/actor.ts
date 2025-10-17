import type { Action } from './action'

type ActorStats = {
  body: number
  speed: number
}
type ActorState = Record<string, number>

type Actor<T> = {
  ID: string
  name: string
  modified: boolean
  actions: Array<Action<T, Actor<T>>>
  stats: ActorStats
  state: ActorState
}

export type { Actor, ActorState }
