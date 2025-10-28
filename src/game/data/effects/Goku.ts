import { v4 } from 'uuid'
import type { SEffect, State } from '../../state'
import { BodyUp } from './body_up'
import type { DeltaContext } from '@/game/types/delta'
import { addEffectResolver, pushMessagesResolver } from '@/game/resolvers'
import { newMessage } from '@/game/dialog'

const Goku: SEffect = {
  ID: v4(),
  delay: 0,
  duration: 1,
  priority: 0,
  modifiers: BodyUp.modifiers,
  triggers: (econtext) => [
    {
      ID: v4(),
      type: 'on-damage',
      validate: (_state: State, tcontext: DeltaContext) => {
        return tcontext.targetIDs.includes(econtext.sourceID)
      },
      resolve: (_state: State, tcontext: DeltaContext) => {
        return [
          pushMessagesResolver(tcontext, [newMessage({ text: '[On Damage]' })]),
          addEffectResolver(BodyUp, econtext),
        ]
      },
    },
  ],
}

export { Goku }
