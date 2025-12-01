import type { Action } from './action'
import type { Effect } from './effect'

type Element = 'physical' | 'fire' | 'shock' | 'psy'

type MainStat = 'strength' | 'faith' | 'intelligence' | 'speed'
type ActorStats = Record<MainStat, number> & {
  accuracy: number
  evasion: number
  health: number
}
type ActorState = {
  alive: 0 | 1
  damage: number
  mana: number

  flinching: 0 | 1
  protected: 0 | 1
  stunned: 0 | 1
}

type Actor<T> = {
  ID: string
  playerID: string
  parentID: string | undefined
  class?: ActorClass<T>
  name: string
  image: string
  modified: boolean
  actions: Array<Action<T, Actor<T>>>
  effects: Array<Effect<T, Actor<T>>>
  stats: ActorStats
  state: ActorState
  cooldowns: Record<string, number>
}

type ModifiedActor<T> = Actor<T> & {
  modified: true
  applied: Record<string, number>
}

type ActorClass<T> = {
  ID: string
  name: string
  actions: Array<Action<T, Actor<T>>>
  stats: ActorStats
  effects: Effect<T, Actor<T>>[]
}

export type {
  Actor,
  ModifiedActor,
  ActorClass,
  ActorStats,
  ActorState,
  MainStat,
  Element,
}
