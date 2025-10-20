import { Goku } from '@/game/data/effects/Goku'
import type { DeltaPositionContext } from '@/game/types/delta'
import { flush, next, nextAction, nextTurnPhase } from '@/game/next'
import type { SAction, State } from '@/game/state'
import { createStore, useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { v4 } from 'uuid'
import { pushAction } from '@/game/mutations'
import { pop } from '@/game/queue'
import type { Player } from '@/game/types/player'
import { createActor } from '@/lib/create-actor'

type GameStateStore = {
  state: State
  pushAction: (action: SAction, context: DeltaPositionContext) => void
  pushPromptAction: (action: SAction, context: DeltaPositionContext) => void
  next: () => void
  flush: () => void
  nextPhase: () => void
}

const Max = createActor('Max', '__player__', {
  accuracy: 0,
  body: 100,
  evasion: 0,
  health: 0,
  reflexes: 100,
  intelligence: 100,
  speed: 100,
})
const Katie = createActor('Katie', '__player__', {
  accuracy: 0,
  body: 100,
  evasion: 0,
  health: 0,
  reflexes: 100,
  intelligence: 180,
  speed: 70,
})
const Hank = createActor('Hank', '__player__', {
  accuracy: 0,
  body: 80,
  evasion: 0,
  health: 0,
  intelligence: 100,
  reflexes: 150,
  speed: 150,
})
const Milo = createActor('Milo', '__player__', {
  accuracy: 0,
  body: 100,
  evasion: 0,
  health: 0,
  intelligence: 100,
  reflexes: 100,
  speed: 100,
})

const player: Player = {
  ID: '__player__',
  activeActorIDs: [null, null, null],
}
const computer: Player = {
  ID: '__ai__',
  activeActorIDs: [],
}

const initialState: State = {
  players: [computer, player],
  turn: {
    phase: 'start',
  },
  actors: [Max, Katie, Hank, Milo],
  effects: [
    {
      ID: v4(),
      effect: Goku,
      context: {
        playerID: player.ID,
        sourceID: Max.ID,
        targetIDs: [],
      },
    },
  ],
  actionQueue: [],
  promptQueue: [],
  triggerQueue: [],
  mutationQueue: [],
  combatLog: [],
}

const gameStateStore = createStore<GameStateStore>((set) => ({
  state: initialState,
  pushAction: (action, context) => {
    set(({ state }) => {
      const existing = state.actionQueue.find(
        (i) => i.context.sourceID === context.sourceID
      )
      if (!!existing) {
        return { state }
      }

      state = pushAction(state, context, action)

      if (state.actionQueue.length === state.actors.length) {
        state = nextTurnPhase(state)
      }

      return {
        state,
      }
    })
  },
  pushPromptAction: (action, context) => {
    set(({ state }) => {
      state = pushAction(state, context, action)
      state = nextAction(state)
      state = {
        ...state,
        promptQueue: pop(state.promptQueue),
      }
      return { state }
    })
  },
  next: () => {
    set(({ state }) => ({
      state: next(state),
    }))
  },
  flush: () => {
    set(({ state }) => ({
      state: flush(state),
    }))
  },
  nextPhase: () => {
    set(({ state }) => ({
      state: nextTurnPhase(state),
    }))
  },
}))

type Selector<T = unknown> = (store: GameStateStore) => T
function useGameState<T = unknown>(selector: Selector<T>) {
  return useStore(gameStateStore, useShallow(selector))
}

export { useGameState, gameStateStore }
