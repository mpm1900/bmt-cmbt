import type { Action } from './action'

type Element = 'physical' | 'fire' | 'shock' | 'psy'

type MainStat = 'body' | 'reflexes' | 'intelligence'
type ActorStats = Record<MainStat, number> & {
  speed: number
}
type ActorState = {
  damage: number
  mana: number
  active: 0 | 1
  alive: 0 | 1
}

type Actor<T> = {
  ID: string
  playerID: string | undefined
  parentID: string | undefined
  type: 'parent' | 'child'
  name: string
  modified: boolean
  actions: Array<Action<T, Actor<T>>>
  stats: ActorStats
  state: ActorState
}

export type { Actor, ActorStats, ActorState, MainStat, Element }
