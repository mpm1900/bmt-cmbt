import { withState } from '@/game/lib/actor'
import type { State, SModifier, SEffect } from '@/game/state'
import { v4 } from 'uuid'

const StunnedModifier: SModifier = {
  ID: v4(),
  priority: 0,
  filter: (a, c) => a.ID === c.parentID,
  apply: (a) => withState<State>(a, { stunned: 1 }),
}

const Stunned: SEffect = {
  ID: v4(),
  name: 'Stunned',
  delay: 0,
  duration: 1,
  persist: false,
  triggers: () => [],
  modifiers: () => [StunnedModifier],
}

export { Stunned, StunnedModifier }
