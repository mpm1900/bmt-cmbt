import { v4 } from 'uuid'
import type { SEffect, State } from '../../state'
import { BodyUp } from './body_up'
import type { DeltaContext } from '@/game/types/delta'
import { addEffectResolver } from '@/game/resolvers'

const Goku: SEffect = {
  ID: v4(),
  modifiers: (context) => BodyUp.modifiers(context),
  triggers: (context) => [
    {
      ID: v4(),
      context,
      trigger: {
        ID: v4(),
        type: 'onDamage',
        validate: (_state: State, tcontext: DeltaContext) => {
          return context.sourceID === tcontext.targetIDs[0]
        },
        resolve: (_state: State, tcontext: DeltaContext) => {
          return [addEffectResolver(BodyUp, tcontext)]
        },
      },
    },
  ],
}

export { Goku }
