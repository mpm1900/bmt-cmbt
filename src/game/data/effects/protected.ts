import { withState } from '@/game/lib/actor'
import type { State, SModifier, SEffect } from '@/game/state'
import { v4 } from 'uuid'

const ProtectedModifier: SModifier = {
  ID: v4(),
  priority: 0,
  filter: (a, c) => a.ID === c.parentID,
  apply: (a) => withState<State>(a, { protected: 1 }),
}

const Protected: SEffect = {
  ID: v4(),
  name: 'Protected',
  delay: 0,
  duration: 1,
  persist: false,
  triggers: () => [],
  modifiers: () => [ProtectedModifier],
}

export { Protected, ProtectedModifier }
