import type { Element, MainStat } from './actor'

type PowerDamage = {
  type: 'power'
  offenseStat: MainStat
  defenseStat: MainStat
  element: Element
  power: number
}

type RawDamage = {
  type: 'raw'
  raw: number
}

type Damage = PowerDamage | RawDamage
export type { Damage, PowerDamage, RawDamage }
