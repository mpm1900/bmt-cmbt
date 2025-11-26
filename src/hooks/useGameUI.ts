import {
  getActionableActors,
  getActor,
  nextAvailableAction,
} from '@/game/access'
import type { State } from '@/game/state'
import { createStore, useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { playerStore } from './usePlayer'

const playerID = playerStore.getState().playerID

export type Point = { x: number; y: number; width: number; height: number }
export type ActorPositions = Record<string, Point>

const GameUIViews = ['actions', 'items', 'switch', 'dialog'] as const
type GameUIState = {
  activeActorID: string | undefined
  activeActionID: string | undefined
  activePlayerTab: 'party' | 'combat-log'
  hoverActorID: string | undefined
  actorPositions: ActorPositions
}

type GameUIStore = GameUIState & {
  set: (state: Partial<GameUIState>) => void
  setActorPosition: (actorId: string, position: Point) => void
  resetActive: (game: State) => void
}

const gameUIStore = createStore<GameUIStore>((set) => {
  return {
    activeActorID: undefined,
    activeActionID: undefined,
    activePlayerTab: 'party',
    hoverActorID: undefined,
    actorPositions: {},
    set: (state: Partial<GameUIState>) => set(state),
    setActorPosition: (actorId: string, position: Point) =>
      set((state) => ({
        actorPositions: {
          ...state.actorPositions,
          [actorId]: position,
        },
      })),
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
        activeActorID: nextActorID,
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
