import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

function InlineMutation(mutation: SAction['resolve']): SAction {
  return {
    ID: v4(),
    name: '',
    targets: {
      get: () => [],
      max: () => 0,
      validate: () => true,
      unique: false,
    },
    validate: () => true,
    resolve: mutation,
  }
}

export { InlineMutation }
