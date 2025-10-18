import type { SAction, State } from './state'
import type { DeltaContext } from './types/delta'

function validateTargetsLength(
  state: State,
  action: SAction,
  context: DeltaContext
): boolean {
  const max = action.targets.max(state, context)
  return context.targetIDs.length <= max
}

function validateTargetValues(
  state: State,
  action: SAction,
  context: DeltaContext
): boolean {
  const all = action.targets.get(state, context)
  return context.targetIDs.every((t) => all.find((a) => a.ID === t))
}

export { validateTargetValues, validateTargetsLength }
