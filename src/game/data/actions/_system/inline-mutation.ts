import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

function InlineMutation(
  resolve: SAction['resolve'],
  validate: SAction['validate'] = () => true
): SAction {
  return {
    ID: v4(),
    name: '',
    targets: {
      get: () => [],
      max: () => 0,
      validate: () => true,
      unique: false,
    },
    validate,
    resolve,
  }
}

export { InlineMutation }
