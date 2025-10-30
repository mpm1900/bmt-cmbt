import type { SAction, SEffect } from '@/game/state'
import { v4 } from 'uuid'

function SetActionsEffect(actions: Array<SAction>): SEffect {
  return {
    ID: v4(),
    name: '',
    delay: 0,
    duration: 2,
    persist: false,
    modifiers: () => [
      {
        ID: v4(),
        priority: 0,
        filter: (actor, context) => actor.ID === context.parentID,
        apply: (actor) => ({
          ...actor,
          actions,
        }),
      },
    ],
    triggers: () => [],
  }
}

export { SetActionsEffect }
