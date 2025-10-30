import { addEffectResolver, pushMessagesResolver } from '@/game/resolvers'
import type { SEffect } from '@/game/state'
import { v4 } from 'uuid'
import { BodyDown } from './body-down'
import { getActiveActorIDs } from '@/game/access'
import { newContext } from '@/game/mutations'
import { newMessage } from '@/game/dialog'
import { EffectTrigger } from '../messages'

const IntimidateID = v4()
const name = 'Intimidate'
const Intimidate: SEffect = {
  ID: IntimidateID,
  name,
  delay: 0,
  duration: undefined,
  modifiers: () => [],
  triggers: (econtext) => [
    {
      ID: v4(),
      type: 'on-actor-activate',
      validate: (_state, tcontext) => {
        return tcontext.sourceID === econtext.sourceID
      },
      resolve: (state, tcontext) => {
        const opponentID = state.dialog.activeNodeID!
        const activeActorIDs = getActiveActorIDs(state, opponentID).filter(
          (id) => id !== null
        )
        return [
          pushMessagesResolver(tcontext, [
            newMessage({
              text: EffectTrigger({ ID: IntimidateID, name }),
              depth: 1,
            }),
          ]),
          activeActorIDs.map((id) => {
            return addEffectResolver(
              BodyDown,
              newContext({
                playerID: opponentID,
                sourceID: tcontext.sourceID,
                parentID: id,
              }),
              0
            )
          }),
        ]
      },
    },
  ],
}

export { Intimidate }
