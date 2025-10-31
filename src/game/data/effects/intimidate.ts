import { addEffectResolver, pushMessagesResolver } from '@/game/resolvers'
import type { SEffect, SMutation } from '@/game/state'
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
  persist: true,
  modifiers: () => [],
  triggers: (econtext) => [
    {
      ID: v4(),
      type: 'on-actor-activate',
      priority: 0,
      validate: (_state, tcontext) => {
        return tcontext.sourceID === econtext.sourceID
      },
      resolve: (state, tcontext) => {
        const opponentID = state.dialog.activeNodeID!
        const activeActorIDs = getActiveActorIDs(state, opponentID).filter(
          (id) => id !== null
        )
        const deltas: Array<SMutation> = []
        if (activeActorIDs.length > 0) {
          deltas.push(
            pushMessagesResolver(tcontext, [
              newMessage({
                text: EffectTrigger({ ID: IntimidateID, name }),
                depth: 1,
              }),
            ])
          )
        }
        deltas.push(
          ...activeActorIDs.map((id) => {
            return addEffectResolver(
              BodyDown,
              newContext({
                playerID: opponentID,
                sourceID: tcontext.sourceID,
                parentID: id,
              }),
              1
            )
          })
        )
        return deltas
      },
    },
  ],
}

export { Intimidate }
