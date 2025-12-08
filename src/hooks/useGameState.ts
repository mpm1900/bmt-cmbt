import { IntroEncounter } from '@/game/data/dialogs/intro'
import { Goku } from '@/game/data/effects/goku'
import {
  addActionToQueue,
  endCombat,
  newContext,
  resolvePrompt,
  sortActionQueue,
  validateState,
} from '@/game/mutations'
import {
  getNextType,
  next,
  nextTurnPhase,
  resolveActionItem,
} from '@/game/next'
import type { SAction, SActionItem, SPlayer, State } from '@/game/state'
import type { DeltaContext } from '@/game/types/delta'
import { createActor } from '@/lib/create-actor'
import { v4 } from 'uuid'
import { createStore, useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { playerStore } from './usePlayer'
import { Intimidate } from '@/game/data/effects/intimidate'
import {
  HANDLE_DEATH,
  HANDLE_TURN_END,
  HANDLE_TURN_START,
} from '@/game/data/effects/_system'
import { useEffect, useState } from 'react'
import { findActor } from '@/game/access'
import { isPlayerDead } from '@/game/player'
import { Protected } from '@/game/data/effects/protected'
import { newActor } from '@/game/lib/actor'
import { Blacksmith } from '@/game/data/actors/classes/blacksmith'

type GameStateStore = {
  state: State
  pushAction: (action: SAction, context: DeltaContext) => void
  filterAction: (actorID: string) => void
  resolvePrompt: (context: DeltaContext) => void
  resolveActionItem: (action: SAction, context: DeltaContext) => void
  next: () => void
  nextPhase: () => void
  deleteCombat: () => void
}

const player: SPlayer = {
  ID: playerStore.getState().playerID,
  activeActorIDs: [null, null, null],
  items: [],
  credits: 9999,
}

const Max = newActor('Max', player.ID, 'man', Blacksmith())
Max.state.damage = 90
Max.effects = [Intimidate, Goku]

const Katie = createActor('Katie', player.ID, 'woman_8', {
  accuracy: 0,
  strength: 100,
  evasion: 0,
  health: 100,
  faith: 100,
  intelligence: 180,
  speed: 70,
})

const Hank = createActor('Hank', player.ID, 'lion', {
  accuracy: 0,
  strength: 180,
  // evasion: 90,
  evasion: 0,
  health: 100,
  intelligence: 100,
  faith: 150,
  speed: 150,
})

const Milo = createActor('Milo', player.ID, 'rac', {
  accuracy: 0,
  strength: 100,
  evasion: 0,
  health: 100,
  intelligence: 100,
  faith: 100,
  speed: 100,
})

const initialState: State = {
  players: [player],
  combat: undefined, //createCombat(),
  encounter: IntroEncounter,
  encounterStates: {},
  pastEncounters: {},
  actors: [Max, Katie, Hank, Milo],
  effects: [
    {
      ID: v4(),
      effect: HANDLE_DEATH,
      context: newContext({}),
    },
    {
      ID: v4(),
      effect: HANDLE_TURN_START,
      context: newContext({}),
    },
    {
      ID: v4(),
      effect: HANDLE_TURN_END,
      context: newContext({}),
    },
    {
      ID: v4(),
      effect: Protected,
      context: newContext({
        playerID: player.ID,
        sourceID: Hank.ID,
        parentID: Hank.ID,
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
  filterAction: (actorID) => {
    set(({ state }) => ({
      state: {
        ...state,
        actionQueue: state.actionQueue.filter(
          (i) => i.context.sourceID !== actorID
        ),
      },
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
  resolveActionItem: (action, context) => {
    set(({ state }) => {
      state = resolveActionItem(state, { action, context })
      return { state }
    })
  },
  deleteCombat: () => {
    set(({ state }) => ({
      state: endCombat(state, state.encounter.ID!),
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

function useGameCurrentAction(): SActionItem | undefined {
  const state = useGameState((s) => s.state)
  const firstActionItem = sortActionQueue(state).actionQueue[0]
  const nextType = getNextType(state)
  const [currentActionItem, setCurrentActionItem] = useState<
    SActionItem | undefined
  >(firstActionItem)

  useEffect(() => {
    if (!state.combat) {
      setCurrentActionItem(undefined)
      return
    }
    const [_, valid] = validateState(state)
    if (!valid || nextType !== 'action') return
    if (state.players.some((p) => isPlayerDead(state, p))) return
    const source = findActor(state, firstActionItem?.context.sourceID)
    if (!source || !source.state.alive) return

    setCurrentActionItem(firstActionItem)
  }, [nextType, firstActionItem?.ID])

  return currentActionItem
}

export { gameStateStore, useGamePhase, useGameState, useGameCurrentAction }
