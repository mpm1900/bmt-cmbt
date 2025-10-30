import { newMessage } from '@/game/dialog'
import {
  deactivateActorResolver,
  decrementEffectsResolver,
  nextTurnResolver,
  pushMessagesResolver,
} from '@/game/resolvers'
import type { SEffect } from '@/game/state'
import { v4 } from 'uuid'
import { ActorDied } from '../messages'

const HANDLE_DEATH: SEffect = {
  ID: v4(),
  name: '',
  delay: 0,
  duration: undefined,
  modifiers: () => [],
  triggers: () => [
    {
      ID: v4(),
      type: 'on-death',
      validate: () => true,
      resolve: (state, tcontext) => {
        return tcontext.targetIDs.flatMap((targetID) => {
          const target = state.actors.find((a) => a.ID === targetID)!
          return [
            pushMessagesResolver(tcontext, [
              newMessage({ text: ActorDied(target) }),
            ]),
            deactivateActorResolver(target.playerID, targetID, tcontext),
          ]
        })
      },
    },
  ],
}

const HANDLE_TURN_START: SEffect = {
  ID: v4(),
  name: '',
  delay: 0,
  duration: undefined,
  modifiers: () => [],
  triggers: () => [
    {
      ID: v4(),
      type: 'on-turn-start',
      validate: () => true,
      resolve: (state, tcontext) => {
        return [
          nextTurnResolver(tcontext),
          pushMessagesResolver(tcontext, [
            newMessage({ text: `Turn ${state.combat!.turn + 1}` }),
          ]),
        ]
      },
    },
  ],
}

const HANDLE_TURN_END: SEffect = {
  ID: v4(),
  name: '',
  delay: 0,
  duration: undefined,
  modifiers: () => [],
  triggers: () => [
    {
      ID: v4(),
      type: 'on-turn-end',
      validate: () => true,
      resolve: (_state, _tcontext) => {
        return [
          decrementEffectsResolver(),
          /*
          pushMessagesResolver(tcontext, [
            newMessage({ text: `Turn ${state.combat?.turn} ended` }),
          ]),
          */
        ]
      },
    },
  ],
}

export { HANDLE_DEATH, HANDLE_TURN_START, HANDLE_TURN_END }
