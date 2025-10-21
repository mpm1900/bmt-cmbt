import type { Element, MainStat } from './actor'

type ChanceEvent = {
  success: boolean
  successRoll: number
  successThreshold: number
  critical: boolean
  criticalRoll: number
  criticalThreshold: number
}

type PowerDamage = {
  type: 'power'
  offenseStat: MainStat
  defenseStat: MainStat
  element: Element
  power: number
  success: boolean
  evade: boolean
  critical: boolean
  criticalModifier: number
}

type RawDamage = {
  type: 'raw'
  raw: number
}

type Damage = PowerDamage | RawDamage
export type { ChanceEvent, Damage, PowerDamage, RawDamage }
