import type { ActorStats, Element } from './actor'

type PowerDamage = {
  type: 'power'
  offenseStat: keyof ActorStats
  defenseStat: keyof ActorStats
  element: Element
  power: number
}

type RawDamage = {
  type: 'raw'
  raw: number
}

type Damage = PowerDamage | RawDamage
export type { Damage, PowerDamage, RawDamage }
