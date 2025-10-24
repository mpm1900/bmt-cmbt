import { getAliveActiveActors, nextAvailableAction } from '@/game/access'
import { newContext } from '@/game/mutations'
import type { State } from '@/game/state'
import type { DeltaPositionContext } from '@/game/types/delta'
import { createStore, useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'

type GameUIState = {
  playerID: string
  view: 'actions' | 'items' | 'switch' | 'dialog'
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
    view: 'dialog',
    activeActorID: undefined,
    activeActionID: undefined,
    stagingContext: undefined,
    set: (state: Partial<GameUIState>) => set(state),
    resetActive: (game: State) => {
      const state = get()
      const playerID = state.playerID
      const nextActor = getAliveActiveActors(
        game,
        newContext({ playerID }),
        (a) => !game.actionQueue.find((q) => q.context.sourceID === a.ID)
      )[0]
      if (nextActor) {
        set({
          activeActorID: nextActor.ID,
          activeActionID: nextAvailableAction(nextActor, game)?.ID,
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
