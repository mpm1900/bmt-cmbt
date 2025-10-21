import { isActive, mapTarget } from '@/game/access'
import { newDamage } from '@/game/actor'
import { damagesResolver } from '@/game/resolvers'
import type { SAction, SMutation } from '@/game/state'
import { chance } from '@/lib/chance'
import { v4 } from 'uuid'

const HotShots: SAction = {
  ID: v4(),
  name: 'Hot Shots',
  validate: () => true,
  targets: {
    unique: false,
    max: () => 1,
    get: (state, context) =>
      state.actors
        .filter((a) => a.ID !== context.sourceID && isActive(state, a.ID))
        .map((a) => mapTarget(a, 'position')),
    validate: (_, context) => context.positions.length === 1,
  },
  resolve: (_, context) => {
    const deltas: Array<SMutation> = []
    let result = chance(80)
    const results = [result[1]]
    while (result[0]) {
      deltas.push(
        damagesResolver(
          context,
          [
            newDamage({
              offenseStat: 'reflexes',
              defenseStat: 'reflexes',
              element: 'fire',
              power: 20,
            }),
          ],
          [context]
        )
      )
      result = chance(80)
      results.push(result[1])
    }
    return deltas
  },
}

export { HotShots }
