import { damageResolver } from '@/game/resolvers'
import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

const BrainBlastDamage = 30

const BrainBlast: SAction = {
  ID: v4(),
  name: 'Brain Blast',
  validate: (_state, context) =>
    0 < context.targetIDs.length && context.targetIDs.length <= 2,
  maxTargetCount: () => 2,
  uniqueTargets: true,
  targets: (state, context) =>
    state.actors.filter((a) => a.ID !== context.sourceID),
  resolve: (_, context) => {
    return [
      context.targetIDs.map((targetID) =>
        damageResolver({ ...context, targetIDs: [targetID] }, BrainBlastDamage)
      ),
    ]
  },
}

export { BrainBlast }
