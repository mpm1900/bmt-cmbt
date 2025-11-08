import type { SDialogAction } from '@/game/state'
import { v4 } from 'uuid'

function InlineMutation(
  resolve: SDialogAction['resolve'],
  map: (a: SDialogAction) => Partial<SDialogAction> = () => ({})
): SDialogAction {
  const base = {
    ID: v4(),
    name: '',
    priority: 0,
    cooldown: () => 0,
    targets: {
      get: () => [],
      max: () => 0,
      validate: () => true,
      unique: false,
    },
    sources: () => [],
    validate: () => true,
    resolve,
  }

  return {
    ...base,
    ...map(base),
  }
}

export { InlineMutation }
