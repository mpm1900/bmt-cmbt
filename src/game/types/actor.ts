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
  name: string
  image: string
  modified: boolean
  actions: Array<Action<T, Actor<T>>>
  stats: ActorStats
  state: ActorState
  cooldowns: Record<string, number>
}

type ModifiedActor<T> = Actor<T> & {
  modified: true
  applied: Record<string, number>
}

export type { Actor, ModifiedActor, ActorStats, ActorState, MainStat, Element }
