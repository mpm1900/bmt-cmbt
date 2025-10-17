import type { ActorStats, Element } from './actor'

type Damage = {
  offenseStat: keyof ActorStats
  defenseStat: keyof ActorStats
  element: Element
  power: number
}

export type { Damage }
