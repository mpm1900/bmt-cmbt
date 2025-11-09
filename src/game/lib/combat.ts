import type { Combat } from '../types/combat'

function newCombat<T, A>(
  partial: Partial<Combat<T, A>> & Pick<Combat<T, A>, 'exitNodeID'>
): Combat<T, A> {
  return {
    turn: 0,
    phase: 'pre',
    effects: [],
    actorFilter: () => true,
    ...partial,
  }
}

export { newCombat }
