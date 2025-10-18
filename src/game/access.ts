import { withEffects } from './actor'
import type { SActor, State, STrigger } from './state'

function getTriggers(state: State): Array<STrigger> {
  return state.effects.flatMap(({ effect, context }) =>
    effect.triggers(context)
  )
}

function getActor(state: State, sourceID: string): SActor | undefined {
  const source = state.actors.find((a) => a.ID === sourceID)
  if (!source) return undefined

  return withEffects(source, state.effects)[0]
}

function mapActor<T = unknown>(
  state: State,
  sourceID: string,
  fn: (a: SActor) => T
): T | undefined {
  const source = getActor(state, sourceID)
  if (!source) return undefined

  return fn(source)
}

export { getTriggers, getActor, mapActor }
