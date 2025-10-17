import { withStats } from '@/game/actor'
import { addEffectResolver } from '@/game/resolvers'
import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

const DragonDance: SAction = {
  ID: v4(),
  name: 'Dragon Dance',
  validate: () => true,
  maxTargetCount: () => 0,
  uniqueTargets: true,
  targets: () => [],
  resolve: (_, context) => {
    return [
      addEffectResolver(
        {
          ID: v4(),
          triggers: () => [],
          modifiers: () => [
            {
              ID: v4(),
              delay: 0,
              duration: undefined,
              priority: 0,
              filter: (a, mcontext) => a.ID === mcontext.sourceID,
              apply: (a) => withStats(a, { body: a.stats.body * 1.5 }),
            },
          ],
        },
        {
          sourceID: context.sourceID,
          targetIDs: [context.sourceID],
        }
      ),
    ]
  },
}

export { DragonDance }
