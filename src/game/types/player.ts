type Player = {
  ID: string
  activeActorIDs: (string | null)[]
}

type Position = {
  ID: string
  playerID: string
  index: number
}

export type { Player, Position }
