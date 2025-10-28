import { v4 } from 'uuid'
import { getStats, withEffects } from './actor'
import { getActorID, getPosition } from './player'
import type { SAction, SActor, SEffectItem, State, STrigger } from './state'
import type { ActionTarget } from './types/action'
import type { DeltaContext, DeltaPositionContext } from './types/delta'
import type { Position } from './types/player'
import { newContext } from './mutations'

function getTriggers(state: State): Array<STrigger> {
  const effects = [...state.effects, ...(state.combat?.effects ?? [])]
  return effects.flatMap(({ effect, context }) => effect.triggers(context))
}

function findActor(
  state: State,
  actorID: string | undefined
): SActor | undefined {
  return state.actors.find((a) => a.ID === actorID)
}

function withStatEffects(actor: SActor, effects: Array<SEffectItem>) {
  const [a, e] = withEffects(actor, effects)
  return [
    {
      ...a,
      stats: getStats(a),
    },
    e,
  ] as const
}

function getActor(
  state: State,
  sourceID: string | undefined
): SActor | undefined {
  const source = findActor(state, sourceID)
  if (!source) return undefined

  const combatEffects = state.combat?.effects ?? []
  const effects = [...state.effects, ...combatEffects]
  let actor = withStatEffects(source, effects)[0]
  return actor
}

function mapActor<T = unknown>(
  state: State,
  actorID: string,
  fn: (a: SActor) => T
): T | undefined {
  const actor = getActor(state, actorID)
  if (!actor) return undefined

  return fn(actor)
}

function mapActorPosition<T = unknown>(
  state: State,
  position: Position,
  fn: (a: SActor) => T
): T | undefined {
  const actorID = getActorID(state, position)
  return actorID ? mapActor(state, actorID, fn) : undefined
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

function getAliveInactiveActors(
  state: State,
  context: DeltaContext,
  fn?: (actor: SActor) => boolean
): Array<SActor> {
  return state.actors.filter(
    (actor) =>
      context.playerID === actor.playerID &&
      !isActive(state, actor.ID) &&
      actor.state.alive &&
      (fn ? fn(actor) : true)
  )
}

function getAliveActiveActors(
  state: State,
  context: DeltaContext,
  fn?: (actor: SActor) => boolean
): Array<SActor> {
  return state.actors.filter(
    (actor) =>
      context.playerID === actor.playerID &&
      isActive(state, actor.ID) &&
      actor.state.alive &&
      (fn ? fn(actor) : true)
  )
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

function getActiveActorIDs(
  state: State,
  playerID: string
): Array<string | null> {
  return (
    state.players.find((player) => player.ID === playerID)?.activeActorIDs || []
  )
}

function hasActiveActorSpace(state: State, playerID: string): boolean {
  const activeActorIDs = getActiveActorIDs(state, playerID)
  return activeActorIDs.some((id) => id === null)
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
  withStatEffects,
  getAliveInactiveActors,
  getAliveActiveActors,
  getActor,
  mapTarget,
  mapActor,
  mapActorPosition,
  isActive,
  isValid,
  nextAvailableAction,
  getActiveActorIDs,
  hasActiveActorSpace,
  convertPositionToTargetContext,
  convertTargetToPositionContext,
}
