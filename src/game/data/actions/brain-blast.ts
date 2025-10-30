import { getActor, isActive, mapTarget } from '@/game/access'
import {
  getSourceChance,
  getTargetChance,
  newDamage,
  withChanceEvents,
} from '@/game/actor'
import { damagesResolver } from '@/game/resolvers'
import type { SAction } from '@/game/state'
import type { PowerDamage } from '@/game/types/damage'
import { v4 } from 'uuid'

const BrainBlastDamage: PowerDamage = newDamage({
  offenseStat: 'intelligence',
  defenseStat: 'intelligence',
  element: 'psy',
  power: 30,
  criticalModifier: 1.5,
})

const BrainBlast: SAction = {
  ID: v4(),
  name: 'Brain Blast',
  priority: 0,
  validate: () => true,
  targets: {
    unique: true,
    max: () => 2,
    get: (state, context) =>
      state.actors
        .filter((a) => a.ID !== context.sourceID && isActive(state, a.ID))
        .map((actor) => mapTarget(actor, 'position')),
    validate: (_state, context) =>
      0 < context.positions.length && context.positions.length <= 2,
  },
  resolve: (state, context) => {
    return [
      context.targetIDs.map((targetID) => {
        const source = getSourceChance(
          100,
          0,
          getActor(state, context.sourceID)!
        )
        const target = getTargetChance(getActor(state, targetID)!)
        const damage = withChanceEvents(BrainBlastDamage, source, target)
        const ctx = { ...context, targetIDs: [targetID] }
        return damagesResolver(ctx, [damage], [ctx], 0)
      }),
    ]
  },
}

export { BrainBlast }
