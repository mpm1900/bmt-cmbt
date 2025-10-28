import type { EffectItem } from './effect'

const CombatPhases = [
  'pre',
  'start',
  'planning',
  'main',
  'end',
  'post',
] as const

type CombatPhase = (typeof CombatPhases)[number]

type Combat<T, A> = {
  turn: number
  phase: CombatPhase
  effects: Array<EffectItem<T, A>>
}

export { CombatPhases }
export type { Combat, CombatPhase }
