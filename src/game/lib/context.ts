import type { DeltaPositionContext } from '../types/delta'

function newContext<T = {}>(
  context: Partial<DeltaPositionContext> & T
): DeltaPositionContext & T {
  return {
    playerID: '',
    sourceID: '',
    parentID: '',
    targetIDs: [],
    positions: [],
    ...context,
  }
}

export { newContext }
