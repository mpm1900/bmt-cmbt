import type { Item } from './item'

type Player<T, A> = {
  ID: string
  activeActorIDs: Array<string | null>
  items: Array<Item<T, A>>
  credits: number
}

type Position = {
  ID: string
  playerID: string
  index: number
}

export type { Player, Position }
