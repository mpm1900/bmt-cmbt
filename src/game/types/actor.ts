import type { Action } from './action'

type Element = 'physical' | 'fire' | 'shock' | 'psy'

type ActorStats = {
  body: number
  reflexes: number
  intelligence: number
  speed: number
}
type ActorState = {
  damage: number
  mana: number
}

type Actor<T> = {
  ID: string
  playerID: string | undefined
  name: string
  modified: boolean
  actions: Array<Action<T, Actor<T>>>
  stats: ActorStats
  state: ActorState
}

export type { Actor, ActorStats, ActorState, Element }
