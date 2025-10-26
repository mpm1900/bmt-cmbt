import type { Item } from './item'

type Player = {
  ID: string
  activeActorIDs: Array<string | null>
  items: Array<Item>
}

type Position = {
  ID: string
  playerID: string
  index: number
}

export type { Player, Position }
