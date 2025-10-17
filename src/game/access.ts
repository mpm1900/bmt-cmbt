import { withEffects } from './actor'
import type { SActor, State, STrigger } from './state'

function getTriggers(state: State): Array<STrigger> {
  return state.effects.flatMap(({ effect, context }) =>
    effect.triggers(context)
  )
}

function mapActor<T = unknown>(
  state: State,
  sourceID: string,
  fn: (a: SActor) => T
): T | undefined {
  const source = state.actors.find((a) => a.ID === sourceID)
  if (!source) return undefined

  return fn(withEffects(source, state.effects)[0])
}
export { getTriggers, mapActor }
