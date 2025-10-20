import { mapTarget } from '@/game/access'
import { damageResolver } from '@/game/resolvers'
import type { SAction, SMutation } from '@/game/state'
import { chance } from '@/lib/chance'
import { v4 } from 'uuid'

const HotShots: SAction = {
  ID: v4(),
  name: 'Hot Shots',
  validate: (_, context) => context.positions.length === 1,
  targets: {
    unique: false,
    max: () => 1,
    get: (state, context) =>
      state.actors
        .filter((a) => a.ID !== context.sourceID)
        .map((a) => mapTarget(a, 'position')),
  },
  resolve: (_, context) => {
    const deltas: Array<SMutation> = []
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
