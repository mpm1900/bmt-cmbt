import {
  deactivateActorResolver,
  decrementEffectsResolver,
  nextTurnResolver,
} from '@/game/resolvers'
import type { SEffect } from '@/game/state'
import { v4 } from 'uuid'

const HANDLE_DEATH: SEffect = {
  ID: v4(),
  delay: 0,
  duration: undefined,
  priority: 0,
  modifiers: () => [],
  triggers: () => [
    {
      ID: v4(),
      type: 'onDeath',
      validate: () => true,
      resolve: (_state, tcontext) => {
        return tcontext.targetIDs.map((targetID) =>
          deactivateActorResolver(tcontext.playerID, targetID, tcontext)
        )
      },
    },
  ],
}

const HANDLE_TURN_START: SEffect = {
  ID: v4(),
  delay: 0,
  duration: undefined,
  priority: 0,
  modifiers: () => [],
  triggers: () => [
    {
      ID: v4(),
      type: 'onTurnStart',
      validate: () => true,
      resolve: (_state, tcontext) => {
        return [nextTurnResolver(tcontext)]
      },
    },
  ],
}

const HANDLE_TURN_END: SEffect = {
  ID: v4(),
  delay: 0,
  duration: undefined,
  priority: 0,
  modifiers: () => [],
  triggers: () => [
    {
      ID: v4(),
      type: 'onTurnEnd',
      validate: () => true,
      resolve: (_state, _tcontext) => {
        return [decrementEffectsResolver()]
      },
    },
  ],
}

export { HANDLE_DEATH, HANDLE_TURN_START, HANDLE_TURN_END }
