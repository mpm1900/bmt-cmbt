import type { SAction, State } from './state'
import type { DeltaPositionContext } from './types/delta'

function validateTargetsLength(
  state: State,
  action: SAction,
  context: DeltaPositionContext
): boolean {
  const max = action.targets.max(state, context)
  return context.positions.length <= max
}

export { validateTargetsLength }
