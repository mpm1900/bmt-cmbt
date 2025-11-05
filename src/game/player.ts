import { v4 } from 'uuid'
import type { SAction, SItem, SPlayer, State } from './state'
import type { Position } from './types/player'
import { getAliveInactiveActors } from './access'
import { newContext } from './mutations'

function getActorID(state: State, position: Position): string | undefined {
  const player = state.players.find((p) => p.ID === position.playerID)
  const actorID = player?.activeActorIDs[position.index]
  return actorID ?? undefined
}

function getPosition(
  state: State,
  actorID: string | undefined
): Position | undefined {
  if (!actorID) return undefined
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

function getMissingActorCount(state: State, playerID: string): number {
  const player = state.players.find((p) => p.ID === playerID)

  const activeActorIDs = player?.activeActorIDs ?? []
  const inactiveLiveActors = getAliveInactiveActors(
    state,
    newContext({ playerID })
  )
  return Math.min(
    inactiveLiveActors.length,
    activeActorIDs.filter((a) => a === null).length
  )
}

function isPlayerDead(state: State, player: SPlayer): boolean {
  const inactiveLiveActors = getAliveInactiveActors(
    state,
    newContext({ playerID: player.ID })
  )
  return (
    player.activeActorIDs.every((id) => id === null) &&
    inactiveLiveActors.length === 0
  )
}

function requiresPrompt(state: State, player: SPlayer): boolean {
  const inactiveLiveActors = getAliveInactiveActors(
    state,
    newContext({ playerID: player.ID })
  )
  return (
    player.activeActorIDs.some((id) => id === null) &&
    inactiveLiveActors.length > 0
  )
}

function getItemAction(item: SItem | undefined): SAction | undefined {
  let action: SAction | undefined = undefined
  if (!item) return undefined
  if (item.use) action = item.use
  if (item.consumable) action = item.consumable
  if (action) {
    action.name = item.name
  }
  return action
}

function groupItems(items: Array<SItem>) {
  return items.reduce(
    (acc, item) => {
      if (acc[item.name] !== undefined) {
        acc[item.name] = acc[item.name] + 1
      } else {
        acc[item.name] = 1
      }
      return acc
    },
    {} as Record<string, number>
  )
}

export {
  getActorID,
  getPosition,
  positionEquals,
  newPosition,
  getMissingActorCount,
  isPlayerDead,
  requiresPrompt,
  getItemAction,
  groupItems,
}
