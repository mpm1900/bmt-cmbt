import { BrainBlast } from '@/game/data/actions/brain-blast'
import { DragonDance } from '@/game/data/actions/dragon-dance'
import { Fireball } from '@/game/data/actions/fireball'
import { Heal } from '@/game/data/actions/heal'
import { HotShots } from '@/game/data/actions/hot-shots'
import { MagicMissile } from '@/game/data/actions/magic-missile'
import type { SActor } from '@/game/state'
import type { ActorStats } from '@/game/types/actor'
import { v4 } from 'uuid'

const actions = [
  Fireball,
  MagicMissile,
  BrainBlast,
  Heal,
  DragonDance,
  HotShots,
]

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
    actions: actions,
    stats,
    state: {
      mana: 100,
      damage: 0,
      alive: 1,
    },
  }
}

export { createActor }
