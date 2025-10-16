import { withStats } from '@/game/actor'
import type { SEffect } from '@/game/state'
import { v4 } from 'uuid'

const BodyUp: SEffect = {
  ID: v4(),
  modifiers: () => [
    {
      ID: v4(),
      delay: 0,
      duration: undefined,
      priority: 0,
      filter: (actor, mcontext) => actor.ID === mcontext.sourceID,
      apply: (actor) => {
        return withStats(actor, { body: actor.stats.body + 10 })
      },
    },
  ],
  triggers: () => [],
}

export { BodyUp }
