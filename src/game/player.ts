import { v4 } from 'uuid'
import type { State } from './state'
import type { Position } from './types/player'

function getActorID(state: State, position: Position): string | undefined {
  const player = state.players.find((p) => p.ID === position.playerID)
  const actorID = player?.activeActorIDs[position.index]
  return actorID ?? undefined
}

function getPosition(state: State, actorID: string): Position | undefined {
  const actor = state.actors.find((a) => a.ID === actorID)
  const player = state.players.find((p) => p.ID === actor?.playerID)
  const index = player?.activeActorIDs.indexOf(actorID)
  return player?.ID && index !== undefined && index !== -1
    ? { ID: v4(), playerID: player.ID, index }
    : undefined
}

function positionEquals(
  a: Position | undefined,
  b: Position | undefined
): boolean {
  return a?.playerID === b?.playerID && a?.index === b?.index
}

function newPosition(playerID: string, index: number): Position {
  return { ID: v4(), playerID, index }
}

export { getActorID, getPosition, positionEquals, newPosition }
