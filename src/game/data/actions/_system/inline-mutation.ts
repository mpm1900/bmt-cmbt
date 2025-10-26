import type { SDialogAction } from '@/game/state'
import { v4 } from 'uuid'

function InlineMutation(
  resolve: SDialogAction['resolve'],
  validate: SDialogAction['validate'] = () => true
): SDialogAction {
  return {
    ID: v4(),
    name: '',
    targets: {
      get: () => [],
      max: () => 0,
      validate: () => true,
      unique: false,
    },
    sources: () => [],
    validate,
    resolve,
  }
}

export { InlineMutation }
