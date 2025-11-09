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
  recoil: number
  lifesteal: number

  success: boolean
  evade: boolean
  critical: boolean
  criticalModifier: number
}

type RawDamage = {
  type: 'raw'
  raw: number
}

type PercentageDamage = {
  type: 'percentage'
  percentage: number
  recoil: number
  lifesteal: number
}

type Damage = (PowerDamage | RawDamage | PercentageDamage) & {
  bypassProtected?: boolean
}

type DamageResult = {
  damage: number
  recoil: number
  lifesteal: number
}

export type {
  ChanceEvent,
  Damage,
  PowerDamage,
  RawDamage,
  PercentageDamage,
  DamageResult,
}
