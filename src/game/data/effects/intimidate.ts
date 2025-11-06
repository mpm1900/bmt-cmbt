import { addEffectResolver, pushMessagesResolver } from '@/game/resolvers'
import type { SEffect, SMutation } from '@/game/state'
import { v4 } from 'uuid'
import { BodyDown } from './body-down'
import { findActor, getActiveActorIDs } from '@/game/access'
import { newContext } from '@/game/mutations'
import { newMessage } from '@/game/encounter'
import { EffectSourceTrigger } from '../messages'

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
        const opponentID = state.encounter.activeNodeID!
        const activeActorIDs = getActiveActorIDs(state, opponentID).filter(
          (id) => id !== null
        )
        const deltas: Array<SMutation> = []
        if (activeActorIDs.length > 0) {
          deltas.push(
            pushMessagesResolver(tcontext, [
              newMessage({
                text: EffectSourceTrigger(
                  IntimidateID,
                  name,
                  findActor(state, tcontext.sourceID)
                ),
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
    {
      ID: v4(),
      type: 'on-turn-start',
      priority: 0,
      validate: (state, _tcontext) => {
        return state.combat?.turn === 0
      },
      resolve: (state, tcontext) => {
        // TODO factor in only doing one or the other
        return []
        const opponentID = state.encounter.activeNodeID!
        const activeActorIDs = getActiveActorIDs(state, opponentID).filter(
          (id) => id !== null
        )
        const deltas: Array<SMutation> = []
        if (activeActorIDs.length > 0) {
          deltas.push(
            pushMessagesResolver(tcontext, [
              newMessage({
                text: EffectSourceTrigger(
                  IntimidateID,
                  name,
                  findActor(state, econtext.sourceID)
                ),
                depth: 0,
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
              0
            )
          })
        )
        return deltas
      },
    },
  ],
}

export { Intimidate }
