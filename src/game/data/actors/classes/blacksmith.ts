import { newStats } from '@/game/lib/actor'
import type { State } from '@/game/state'
import type { ActorClass } from '@/game/types/actor'
import { v4 } from 'uuid'
import { Smash } from '../../actions/smash'

function Blacksmith(): ActorClass<State> {
  return {
    ID: v4(),
    name: 'Blacksmith',
    actions: [Smash],
    effects: [],
    stats: newStats({
      health: 100,
      faith: 50,
      intelligence: 30,
      strength: 80,
      speed: 50,
    }),
  }
}

export { Blacksmith }
