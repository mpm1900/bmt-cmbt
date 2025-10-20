import type { SActor } from '@/game/state'
import type { ActorStats } from '@/game/types/actor'
import { v4 } from 'uuid'

function createActor(
  name: string,
  playerID: string,
  stats: ActorStats
): SActor {
  return {
    ID: v4(),
    playerID: playerID,
    parentID: undefined,
    name,
    modified: false,
    actions: [],
    stats,
    state: {
      mana: 100,
      damage: 0,
      alive: 1,
    },
  }
}

export { createActor }
