import {
  findActor,
  getActiveActorIDs,
  nextAvailableAction,
} from '@/game/access'
import type { State } from '@/game/state'
import { createStore, useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { playerStore } from './usePlayer'

const GameUIViews = ['actions', 'items', 'switch', 'dialog'] as const
type GameUIState = {
  view: (typeof GameUIViews)[number]
  activeActorID: string | undefined
  activeActionID: string | undefined
}

type GameUIStore = GameUIState & {
  set: (state: Partial<GameUIState>) => void
  resetActive: (game: State) => void
}

const gameUIStore = createStore<GameUIStore>((set) => {
  return {
    view: 'dialog',
    activeActorID: undefined,
    activeActionID: undefined,
    set: (state: Partial<GameUIState>) => set(state),
    resetActive: (game: State) => {
      const nextActorID = getActiveActorIDs(
        game,
        playerStore.getState().playerID
      ).find(
        (a) =>
          a !== null && !game.actionQueue.find((q) => q.context.sourceID === a)
      )
      if (!nextActorID) return
      set({
        activeActorID: nextActorID,
        activeActionID: nextAvailableAction(findActor(game, nextActorID), game)
          ?.ID,
      })
    },
  }
})
type Selector<T = unknown> = (store: GameUIStore) => T
function useGameUI<T = unknown>(selector: Selector<T>) {
  return useStore(gameUIStore, useShallow(selector))
}

export { useGameUI, gameUIStore, GameUIViews }
