import type { State } from '@/game/state'
import type { DeltaPositionContext } from '@/game/types/delta'
import { createStore, useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'

type GameUIState = {
  playerID: string
  planningView: 'actions' | 'items' | 'switch'
  activeActorID: string | undefined
  activeActionID: string | undefined
  stagingContext: DeltaPositionContext | undefined
}

type GameUIStore = GameUIState & {
  set: (state: Partial<GameUIState>) => void
  next: (game: State) => void
}

const gameUIStore = createStore<GameUIStore>((set) => {
  return {
    playerID: '__player__',
    planningView: 'actions',
    activeActorID: undefined,
    activeActionID: undefined,
    stagingContext: undefined,
    set: (state: Partial<GameUIState>) => set(state),
    next: (game: State) => {
      // Implement logic to advance the game state
      const nextAvailableActor = game.actors.find(
        (a) => !game.actionQueue.find((q) => q.context.sourceID === a.ID)
      )
      if (nextAvailableActor) {
        set({ activeActorID: nextAvailableActor.ID })
      }
    },
  }
})
type Selector<T = unknown> = (store: GameUIStore) => T
function useGameUI<T = unknown>(selector: Selector<T>) {
  return useStore(gameUIStore, useShallow(selector))
}

export { useGameUI, gameUIStore }
