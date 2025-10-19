import { damageResolver } from '@/game/resolvers'
import type { SAction, State } from '@/game/state'
import type { DeltaQueueItem } from '@/game/types/delta'
import { chance } from '@/lib/chance'
import { v4 } from 'uuid'

const HotShots: SAction = {
  ID: v4(),
  name: 'Hot Shots',
  validate: (_, context) => context.targetIDs.length === 1,
  targets: {
    unique: false,
    max: () => 1,
    get: (state, context) =>
      state.actors.filter((a) => a.ID !== context.sourceID),
  },
  resolve: (_, context) => {
    const deltas: Array<DeltaQueueItem<State>> = []
    while (chance(50)) {
      deltas.push(
        damageResolver(context, {
          type: 'power',
          offenseStat: 'reflexes',
          defenseStat: 'reflexes',
          element: 'fire',
          power: 20,
          criticalModifier: 1,
        })
      )
    }
    return deltas
  },
}

export { HotShots }
