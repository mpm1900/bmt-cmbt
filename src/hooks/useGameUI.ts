import { isActive } from '@/game/access'
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
  resetActive: (game: State) => void
}

const gameUIStore = createStore<GameUIStore>((set, get) => {
  return {
    playerID: '__player__',
    planningView: 'actions',
    activeActorID: undefined,
    activeActionID: undefined,
    stagingContext: undefined,
    set: (state: Partial<GameUIState>) => set(state),
    resetActive: (game: State) => {
      const playerID = get().playerID
      const player = game.players.find((p) => p.ID === playerID)
      const nextAvailableActor = player?.activeActorIDs.find(
        (a) =>
          a &&
          player.ID === playerID &&
          isActive(game, a) &&
          !game.actionQueue.find((q) => q.context.sourceID === a)
      )
      if (nextAvailableActor) {
        set({
          activeActorID: nextAvailableActor,
          activeActionID: undefined,
          stagingContext: undefined,
        })
      }
    },
  }
})
type Selector<T = unknown> = (store: GameUIStore) => T
function useGameUI<T = unknown>(selector: Selector<T>) {
  return useStore(gameUIStore, useShallow(selector))
}

export { useGameUI, gameUIStore }
