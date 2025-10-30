import { v4 } from 'uuid'
import type { SEffect, State } from '../../state'
import { BodyUp } from './body-up'
import type { DeltaContext } from '@/game/types/delta'
import { addEffectResolver, pushMessagesResolver } from '@/game/resolvers'
import { newMessage } from '@/game/dialog'
import { EffectTrigger } from '../messages'

const GokuID = v4()
const name = 'Goku'
const Goku: SEffect = {
  ID: GokuID,
  name,
  delay: 0,
  duration: 1,
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
          pushMessagesResolver(tcontext, [
            newMessage({
              text: EffectTrigger({ ID: GokuID, name }),
              depth: 1,
            }),
          ]),
          addEffectResolver(BodyUp, econtext, 1),
        ]
      },
    },
  ],
}

export { Goku }
