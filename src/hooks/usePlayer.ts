import { v4 } from 'uuid'
import { createStore, useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'

type PlayerState = {
  playerID: string
}

type PlayerStore = PlayerState & {}

const playerStore = createStore<PlayerStore>(() => ({
  playerID: v4(),
}))

type Selector<T = unknown> = (store: PlayerStore) => T
function usePlayer<T = unknown>(selector: Selector<T>) {
  return useStore(playerStore, useShallow(selector))
}
function usePlayerID() {
  return useStore(playerStore, (store) => store.playerID)
}

export { playerStore, usePlayer, usePlayerID }
