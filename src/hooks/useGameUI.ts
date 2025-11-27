import {
  getActionableActors,
  getActor,
  nextAvailableAction,
} from '@/game/access'
import type { State } from '@/game/state'
import { createStore, useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { playerStore } from './usePlayer'
import type { DeltaContext } from '@/game/types/delta'
import { newContext } from '@/game/mutations'

const playerID = playerStore.getState().playerID

export type ActorRefs = Record<string, React.RefObject<HTMLDivElement>[]>

const GameUIViews = ['actions', 'items', 'switch', 'dialog'] as const
type GameUIState = {
  activeActionID: string | undefined
  activeContext: DeltaContext
  activePlayerTab: 'party' | 'combat-log'
  activeRefs: ActorRefs
  activeActionRef: React.RefObject<HTMLDivElement> | undefined
  hoverActorID: string | undefined
}

type GameUIStore = GameUIState & {
  set: (state: Partial<GameUIState>) => void
  setActiveContext: (context: Partial<DeltaContext>) => void
  setActiveRefs: (
    playerID: string,
    index: number,
    ref: React.RefObject<HTMLDivElement>
  ) => void
  resetActive: (game: State) => void
}

const gameUIStore = createStore<GameUIStore>((set) => {
  return {
    activeActionID: undefined,
    activeContext: newContext({}),
    activePlayerTab: 'party',
    activeRefs: {},
    activeActionRef: undefined,
    hoverActorID: undefined,

    set: (state: Partial<GameUIState>) => set(state),
    setActiveContext: (context) => {
      set({
        activeContext: newContext<{}>(context),
      })
    },
    setActiveRefs: (playerID, index, ref) => {
      set((state) => {
        const refs = state.activeRefs[playerID]
        if (!refs) {
          return {
            activeRefs: {
              ...state.activeRefs,
              [playerID]: [ref],
            },
          }
        }
        refs[index] = ref
        return {
          activeRefs: {
            ...state.activeRefs,
            [playerID]: refs,
          },
        }
      })
    },
    resetActive: (game: State) => {
      const nextActorID = getActionableActors(
        game,
        (a) => a.playerID === playerID
      ).find(
        (a) => !game.actionQueue.find((q) => q.context.sourceID === a.ID)
      )?.ID
      if (!nextActorID) return

      const actor = getActor(game, nextActorID)
      set({
        activeContext: newContext({
          playerID: actor?.playerID,
          sourceID: actor?.ID,
        }),
        activeActionID: nextAvailableAction(actor, game)?.ID,
      })
    },
  }
})
type Selector<T = unknown> = (store: GameUIStore) => T
function useGameUI<T = unknown>(selector: Selector<T>) {
  return useStore(gameUIStore, useShallow(selector))
}

export { useGameUI, gameUIStore, GameUIViews }
