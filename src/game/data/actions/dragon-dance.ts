import { addEffectResolver } from '@/game/resolvers'
import type { SAction } from '@/game/state'
import { v4 } from 'uuid'
import { BodyUp } from '../effects/body-up'

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
      addEffectResolver(BodyUp, {
        ...context,
        parentID: context.sourceID,
        sourceID: context.sourceID,
        targetIDs: [context.sourceID],
      }),
    ]
  },
}

export { DragonDance }
