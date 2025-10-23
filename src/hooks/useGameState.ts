import { Goku } from '@/game/data/effects/Goku'
import type { DeltaPositionContext } from '@/game/types/delta'
import { flush, next, nextTurnPhase } from '@/game/next'
import { createCombat, type SAction, type State } from '@/game/state'
import { createStore, useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { v4 } from 'uuid'
import { addActionToQueue, newContext, resolvePrompt } from '@/game/mutations'
import type { Player } from '@/game/types/player'
import { createActor } from '@/lib/create-actor'
import { withState } from '@/game/actor'

type GameStateStore = {
  state: State
  pushAction: (action: SAction, context: DeltaPositionContext) => void
  resolvePrompt: (context: DeltaPositionContext) => void
  next: () => void
  flush: () => void
  nextPhase: () => void
  createCombat: () => void
  deleteCombat: () => void
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
  body: 180,
  evasion: 100,
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
const Criminal = createActor('Criminal', '__ai__', {
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
  activeActorIDs: [null, null, null],
}

const initialState: State = {
  players: [computer, player],
  combat: undefined, //createCombat(),
  actors: [Max, Katie, Hank, Milo, Criminal],
  effects: [
    {
      ID: v4(),
      effect: Goku,
      context: newContext({
        playerID: player.ID,
        sourceID: Max.ID,
      }),
    },
  ],
  actionQueue: [],
  promptQueue: [],
  triggerQueue: [],
  mutationQueue: [],
  combatLog: ['Combat started'],
}

const gameStateStore = createStore<GameStateStore>((set) => ({
  state: initialState,
  pushAction: (action, context) => {
    set(({ state }) => ({
      state: addActionToQueue(state, context, action),
    }))
  },
  resolvePrompt: (context) => {
    set(({ state }) => {
      state = resolvePrompt(state, context)
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
      state: {
        ...nextTurnPhase(state),
        promptQueue: [],
      },
    }))
  },
  createCombat: () => {
    set(({ state }) => ({
      state: next({
        ...state,
        combat: createCombat(),
        players: state.players.map((p) => ({
          ...p,
          activeActorIDs: p.activeActorIDs.map((_) => null),
        })),
        actors: state.actors.map((a) =>
          a.ID === Criminal.ID ? withState(a, { damage: 0, alive: 1 }) : a
        ),
      }),
    }))
  },
  deleteCombat: () => {
    set(({ state }) => ({
      state: {
        ...state,
        combat: undefined,
      },
    }))
  },
}))

type Selector<T = unknown> = (store: GameStateStore) => T
function useGameState<T = unknown>(selector: Selector<T>) {
  return useStore(gameStateStore, useShallow(selector))
}

function useGamePhase() {
  return useGameState((s) => s.state.combat?.phase)
}

export { useGameState, gameStateStore, useGamePhase }
