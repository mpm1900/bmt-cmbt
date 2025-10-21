import { v4 } from 'uuid'
import { withEffects } from './actor'
import { getActorID, getPosition } from './player'
import type { SAction, SActor, State, STrigger } from './state'
import type { ActionTarget } from './types/action'
import type { DeltaContext, DeltaPositionContext } from './types/delta'
import type { Position } from './types/player'
import { newContext } from './mutations'

function getTriggers(state: State): Array<STrigger> {
  const effects = [...state.effects, ...(state.battle?.effects ?? [])]
  return effects.flatMap(({ effect, context }) => effect.triggers(context))
}

function findActor(
  state: State,
  actorID: string | undefined
): SActor | undefined {
  return state.actors.find((a) => a.ID === actorID)
}

function getActor(
  state: State,
  sourceID: string | undefined
): SActor | undefined {
  const source = findActor(state, sourceID)
  if (!source) return undefined

  const effects = [...state.effects, ...(state.battle?.effects ?? [])]
  return withEffects(source, effects)[0]
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

function mapTarget(
  actor: SActor,
  type: ActionTarget<SActor>['type']
): ActionTarget<SActor> {
  return {
    ID: v4(),
    type,
    target: actor,
  }
}

function isActive(state: State, actorID: string) {
  return state.players.some((player) => player.activeActorIDs.includes(actorID))
}

function isValid(
  action: SAction | undefined,
  state: State,
  context: DeltaPositionContext
) {
  const valid = action && action.validate(state, context)
  return valid
}

function nextAvailableAction(
  actor: SActor | undefined,
  state: State
): SAction | undefined {
  return actor?.actions.find((a) =>
    isValid(a, state, newContext({ sourceID: actor.ID }))
  )
}

function convertTargetToPositionContext(
  state: State,
  context: DeltaContext
): DeltaPositionContext {
  const positions_targets = context.targetIDs.map(
    (targetID) =>
      [getPosition(state, targetID), targetID] as [Position | undefined, string]
  )
  return {
    playerID: context.playerID,
    sourceID: context.sourceID,
    positions: positions_targets
      .filter((pt) => pt[0] !== undefined)
      .map((pt) => pt[0]!),
    targetIDs: positions_targets
      .filter((pt) => pt[0] === undefined)
      .map((pt) => pt[1]),
  }
}

function convertPositionToTargetContext(
  state: State,
  context: DeltaPositionContext
): DeltaContext {
  const targetIDs = context.positions.map((p) => getActorID(state, p))

  return {
    playerID: context.playerID,
    sourceID: context.sourceID,
    targetIDs: targetIDs
      .filter((id) => id !== undefined)
      .concat(context.targetIDs),
  }
}

export {
  getTriggers,
  findActor,
  getActor,
  mapTarget,
  mapActor,
  isActive,
  isValid,
  nextAvailableAction,
  convertPositionToTargetContext,
  convertTargetToPositionContext,
}
