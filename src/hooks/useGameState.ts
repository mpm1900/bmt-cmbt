import { Goku } from '@/game/data/effects/Goku'
import type { DeltaContext } from '@/game/types/delta'
import { flush, next, nextAction, nextTurnPhase } from '@/game/next'
import type { Player, SAction, SActor, State } from '@/game/state'
import { createStore, useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { v4 } from 'uuid'
import { pushAction } from '@/game/mutations'
import { pop } from '@/game/queue'

type GameStateStore = {
  state: State
  pushAction: (action: SAction, context: DeltaContext) => void
  pushPromptAction: (action: SAction, context: DeltaContext) => void
  next: () => void
  flush: () => void
  nextPhase: () => void
}

const player: Player = {
  ID: '__player__',
}
const computer: Player = {
  ID: undefined,
}

const Max: SActor = {
  ID: v4(),
  playerID: player.ID,
  parentID: undefined,
  type: 'parent',
  name: 'MAX',
  modified: false,
  actions: [],
  stats: {
    accuracy: 0,
    body: 100,
    evasion: 0,
    health: 0,
    reflexes: 100,
    intelligence: 100,
    speed: 100,
  },
  state: {
    mana: 100,
    damage: 0,
    active: 0,
    alive: 1,
  },
}

const initialState: State = {
  players: [computer, player],
  turn: {
    phase: 'start',
  },
  actors: [
    Max,
    {
      ID: v4(),
      playerID: player.ID,
      parentID: undefined,
      type: 'parent',
      name: 'KATIE',
      modified: false,
      actions: [],
      stats: {
        accuracy: 0,
        body: 100,
        evasion: 0,
        health: 0,
        reflexes: 100,
        intelligence: 180,
        speed: 70,
      },
      state: {
        mana: 100,
        damage: 0,
        active: 0,
        alive: 1,
      },
    },
    {
      ID: v4(),
      playerID: player.ID,
      name: 'HANK',
      parentID: undefined,
      type: 'parent',
      modified: false,
      actions: [],
      stats: {
        accuracy: 0,
        body: 80,
        evasion: 0,
        health: 0,
        intelligence: 100,
        reflexes: 150,
        speed: 150,
      },
      state: {
        mana: 100,
        damage: 0,
        active: 0,
        alive: 1,
      },
    },
  ],
  effects: [
    {
      ID: v4(),
      effect: Goku,
      context: {
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
  pushAction: (action: SAction, context: DeltaContext) => {
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
  pushPromptAction: (action: SAction, context: DeltaContext) => {
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
