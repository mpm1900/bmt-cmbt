import type { DeltaContext } from '../types/delta'

function newContext<T = {}>(
  context: Partial<DeltaContext> & T
): DeltaContext & T {
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
