import { IntroDialog } from '@/game/data/dialogs/intro'
import { Goku } from '@/game/data/effects/goku'
import {
  addActionToQueue,
  endCombat,
  newContext,
  resolveDialogOption,
  resolvePrompt,
} from '@/game/mutations'
import { next, nextTurnPhase } from '@/game/next'
import type { SAction, SDialogOption, SPlayer, State } from '@/game/state'
import type { DeltaPositionContext } from '@/game/types/delta'
import { createActor } from '@/lib/create-actor'
import { v4 } from 'uuid'
import { createStore, useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { playerStore } from './usePlayer'
import { Intimidate } from '@/game/data/effects/intimidate'

type GameStateStore = {
  state: State
  pushAction: (action: SAction, context: DeltaPositionContext) => void
  resolvePrompt: (context: DeltaPositionContext) => void
  resolveDialogOption: (option: SDialogOption) => void
  next: () => void
  nextPhase: () => void
  deleteCombat: (encounterID: string) => void
}

const player: SPlayer = {
  ID: playerStore.getState().playerID,
  activeActorIDs: [null, null, null],
  items: [
    {
      ID: v4(),
      name: 'Data Shard',
      consumable: undefined,
      use: undefined,
      actions: undefined,
      effect: undefined,
    },
  ],
}

const Max = createActor('Max', player.ID, {
  accuracy: 0,
  body: 100,
  evasion: 0,
  health: 0,
  reflexes: 100,
  intelligence: 100,
  speed: 100,
})
Max.state.damage = 20
const Katie = createActor('Katie', player.ID, {
  accuracy: 0,
  body: 100,
  evasion: 0,
  health: 0,
  reflexes: 100,
  intelligence: 180,
  speed: 70,
})
const Hank = createActor('Hank', player.ID, {
  accuracy: 0,
  body: 180,
  evasion: 100,
  health: 0,
  intelligence: 100,
  reflexes: 150,
  speed: 150,
})
const Milo = createActor('Milo', player.ID, {
  accuracy: 0,
  body: 100,
  evasion: 0,
  health: 0,
  intelligence: 100,
  reflexes: 100,
  speed: 100,
})

const initialState: State = {
  players: [player],
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
        parentID: Max.ID,
      }),
    },
    {
      ID: v4(),
      effect: Intimidate,
      context: newContext({
        playerID: player.ID,
        sourceID: Max.ID,
        parentID: Max.ID,
      }),
    },
  ],
  actionQueue: [],
  promptQueue: [],
  triggerQueue: [],
  mutationQueue: [],
  combatLog: [],
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
    set(({ state }) => ({
      state: resolvePrompt(state, context),
    }))
  },
  next: () => {
    set(({ state }) => ({
      state: next(state),
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
  deleteCombat: (encounterID: string) => {
    set(({ state }) => ({
      state: endCombat(state, encounterID),
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

export { gameStateStore, useGamePhase, useGameState }
