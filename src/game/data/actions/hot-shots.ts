import { getActor, isActive, mapTarget } from '@/game/access'
import {
  getSourceChance,
  getTargetChance,
  newDamage,
  withChanceEvents,
} from '@/game/lib/damage'
import { damagesResolver } from '@/game/resolvers'
import type { SAction, SMutation } from '@/game/state'
import type { Damage } from '@/game/types/damage'
import { chance } from '@/lib/chance'
import { v4 } from 'uuid'

const HotShotsDamage: Damage = newDamage({
  offenseStat: 'reflexes',
  defenseStat: 'reflexes',
  element: 'fire',
  power: 1,
})

const HotShots: SAction = {
  ID: v4(),
  name: 'Hot Shots',
  priority: 0,
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
  resolve: (state, context) => {
    const source = getActor(state, context.sourceID)!
    const sChance = getSourceChance(100, 0, source)
    const target = getActor(state, context.targetIDs[0])!
    if (!target) return []

    const tChance = getTargetChance(target)
    const damage = withChanceEvents(HotShotsDamage, sChance, tChance)
    const deltas: Array<SMutation> = []
    let result = chance(92)
    const results = [result[1]]
    while (result[0]) {
      deltas.push(damagesResolver(context, [damage], [context], 0))
      result = chance(92)
      results.push(result[1])
    }
    return deltas
  },
}

export { HotShots }
