import type { Combat } from '../types/combat'
import type { EffectItem } from '../types/effect'

function newCombat<T, A>(
  exitNodeID: string,
  effects: EffectItem<T, A>[]
): Combat<T, A> {
  return {
    exitNodeID,
    turn: 0,
    phase: 'pre',
    effects,
  }
}

export { newCombat }
