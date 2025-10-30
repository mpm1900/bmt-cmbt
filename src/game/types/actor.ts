import type { Action } from './action'

type Element = 'physical' | 'fire' | 'shock' | 'psy'

type MainStat = 'body' | 'reflexes' | 'mind'
type ActorStats = Record<MainStat, number> & {
  accuracy: number
  evasion: number
  health: number
  speed: number
}
type ActorState = {
  damage: number
  mana: number
  alive: 0 | 1
}

type Actor<T> = {
  ID: string
  playerID: string
  parentID: string | undefined
  name: string
  modified: boolean
  actions: Array<Action<T, Actor<T>>>
  stats: ActorStats
  state: ActorState
}

export type { Actor, ActorStats, ActorState, MainStat, Element }
