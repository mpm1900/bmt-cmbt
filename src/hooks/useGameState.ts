import { Goku } from '@/game/data/effects/Goku'
import type { DeltaContext } from '@/game/types/delta'
import { flush, next } from '@/game/next'
import type { SAction, SActor, State } from '@/game/state'
import { createStore, useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { v4 } from 'uuid'
import { pushAction } from '@/game/mutations'

type GameStateStore = {
  state: State
  pushAction: (action: SAction, context: DeltaContext) => void
  next: () => void
  flush: () => void
}

const Max: SActor = {
  ID: v4(),
  name: 'MAX',
  modified: false,
  actions: [],
  stats: {
    body: 100,
  },
  state: {
    mana: 100,
    damage: 0,
  },
}

const initialState: State = {
  players: [],
  actors: [
    Max,
    {
      ID: v4(),
      name: 'KATIE',
      modified: false,
      actions: [],
      stats: {
        body: 180,
      },
      state: {
        mana: 100,
        damage: 0,
      },
    },
    {
      ID: v4(),
      name: 'HANK',
      modified: false,
      actions: [],
      stats: {
        body: 80,
      },
      state: {
        mana: 100,
        damage: 0,
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
  actionQueue: {
    queue: [],
    active: undefined,
  },
  triggerQueue: {
    queue: [],
    active: undefined,
  },
  mutationQueue: {
    queue: [],
    active: undefined,
  },
}

const gameStateStore = createStore<GameStateStore>((set) => ({
  state: initialState,
  pushAction: (action: SAction, context: DeltaContext) => {
    set(({ state }) => ({
      state: pushAction(state, action, context),
    }))
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
}))

type Selector<T = unknown> = (store: GameStateStore) => T
function useGameState<T = unknown>(selector: Selector<T>) {
  return useStore(gameStateStore, useShallow(selector))
}

export { useGameState, gameStateStore }
