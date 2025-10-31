import { v4 } from 'uuid'
import type { SEffect, State } from '../../state'
import { BodyUp } from './body-up'
import type { DeltaContext } from '@/game/types/delta'
import { addEffectResolver, pushMessagesResolver } from '@/game/resolvers'
import { newMessage } from '@/game/dialog'
import { EffectTrigger } from '../messages'
import { findActor } from '@/game/access'

const GokuID = v4()
const name = 'Goku'
const Goku: SEffect = {
  ID: GokuID,
  name,
  delay: 0,
  duration: 1,
  persist: true,
  modifiers: BodyUp.modifiers,
  triggers: (econtext) => [
    {
      ID: v4(),
      type: 'on-damage',
      priority: 0,
      validate: (state: State, tcontext: DeltaContext) => {
        return (
          !!findActor(state, econtext.sourceID)?.state.alive &&
          tcontext.targetIDs.includes(econtext.sourceID)
        )
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
