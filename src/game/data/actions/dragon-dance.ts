import { withStats } from '@/game/actor'
import { addEffectResolver } from '@/game/resolvers'
import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

const DragonDance: SAction = {
  ID: v4(),
  name: 'Dragon Dance',
  priority: 0,
  validate: () => true,
  targets: {
    unique: true,
    max: () => 0,
    get: () => [],
    validate: () => true,
  },
  resolve: (_, context) => {
    return [
      addEffectResolver(
        {
          ID: v4(),
          name: 'Body x1.5',
          delay: 0,
          duration: undefined,
          priority: 0,
          triggers: () => [],
          modifiers: () => [
            {
              ID: v4(),
              filter: (a, mcontext) => a.ID === mcontext.sourceID,
              apply: (a) => withStats(a, { body: a.stats.body * 1.5 }),
            },
          ],
        },
        {
          playerID: context.playerID,
          sourceID: context.sourceID,
          targetIDs: [context.sourceID],
        }
      ),
    ]
  },
}

export { DragonDance }
