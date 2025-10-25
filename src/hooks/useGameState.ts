import { Goku } from '@/game/data/effects/Goku'
import type { DeltaPositionContext } from '@/game/types/delta'
import { flush, next, nextTurnPhase } from '@/game/next'
import type { SAction, SDialogOption, State } from '@/game/state'
import { createStore, useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { v4 } from 'uuid'
import {
  addActionToQueue,
  newContext,
  resolveDialogOption,
  resolvePrompt,
} from '@/game/mutations'
import type { Player } from '@/game/types/player'
import { createActor } from '@/lib/create-actor'
import { IntroDialog } from '@/game/data/dialogs/intro'

type GameStateStore = {
  state: State
  pushAction: (action: SAction, context: DeltaPositionContext) => void
  resolvePrompt: (context: DeltaPositionContext) => void
  resolveDialogOption: (option: SDialogOption) => void
  next: () => void
  flush: () => void
  nextPhase: () => void
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
  dialog: IntroDialog,
  actors: [Max, Katie, Hank, Milo],
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
  messageLog: [],
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
  resolveDialogOption: (option) => {
    set(({ state }) => {
      state = resolveDialogOption(state, option.context, option)
      return { state }
    })
  },
  deleteCombat: () => {
    set(({ state }) => ({
      state: {
        ...state,
        combat: undefined,
        actionQueue: [],
        triggerQueue: [],
        mutationQueue: [],
        promptQueue: [],
        // TODO: hard-coded ai player ID
        actors: state.actors.filter(
          (a) => a.playerID !== '__ai__' && a.state.alive
        ),
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
