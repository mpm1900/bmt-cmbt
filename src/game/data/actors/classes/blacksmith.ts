import { newStats } from '@/game/lib/actor'
import type { State } from '@/game/state'
import type { ActorClass } from '@/game/types/actor'
import { v4 } from 'uuid'

function Blacksmith(): ActorClass<State> {
  return {
    ID: v4(),
    name: 'Blacksmith',
    actions: [],
    effects: [],
    stats: newStats({}),
  }
}

export { Blacksmith }
