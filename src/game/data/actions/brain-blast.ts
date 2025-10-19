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
    0 < context.targetIDs.length && context.targetIDs.length <= 2,
  targets: {
    unique: true,
    max: () => 2,
    get: (state, context) =>
      state.actors.filter((a) => a.ID !== context.sourceID),
  },
  resolve: (_, context) => {
    return [
      context.targetIDs.map((targetID) =>
        damageResolver({ ...context, targetIDs: [targetID] }, BrainBlastDamage)
      ),
    ]
  },
}

export { BrainBlast }
