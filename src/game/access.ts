import { withModifiers } from './actor'
import type { SActor, SModifier, State, STriggerItem } from './state'

function getModifiers(state: State): Array<SModifier> {
  return state.effects
    .flatMap(({ effect, context }) => effect.modifiers(context))
    .sort((a, b) => a.priority - b.priority)
}

function getTriggers(state: State): Array<STriggerItem> {
  return state.effects.flatMap(({ effect, context }) =>
    effect.triggers(context)
  )
}
function mapActor<T = unknown>(
  state: State,
  sourceID: string,
  fn: (a: SActor) => T
): T | undefined {
  const modifiers = getModifiers(state)
  const source = state.actors.find((a) => a.ID === sourceID)
  if (!source) return undefined

  return fn(withModifiers(source, modifiers)[0])
}
export { getModifiers, getTriggers, mapActor }
