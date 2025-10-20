import { isActive, mapTarget } from '@/game/access'
import { damageResolver } from '@/game/resolvers'
import type { SAction } from '@/game/state'
import type { PowerDamage } from '@/game/types/damage'
import { v4 } from 'uuid'

const BrainBlastDamage: PowerDamage = {
  type: 'power',
  offenseStat: 'intelligence',
  defenseStat: 'intelligence',
  element: 'psy',
  power: 30,
  criticalModifier: 1.5,
}

const BrainBlast: SAction = {
  ID: v4(),
  name: 'Brain Blast',
  validate: (_state, context) =>
    0 < context.positions.length && context.positions.length <= 2,
  targets: {
    unique: true,
    max: () => 2,
    get: (state, context) =>
      state.actors
        .filter((a) => a.ID !== context.sourceID && isActive(state, a.ID))
        .map((actor) => mapTarget(actor, 'position')),
  },
  resolve: (_, context) => {
    return [
      context.targetIDs.map((targetID) => {
        return damageResolver(
          { ...context, targetIDs: [targetID] },
          BrainBlastDamage
        )
      }),
    ]
  },
}

export { BrainBlast }
