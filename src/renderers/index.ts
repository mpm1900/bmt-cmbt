import { Fireball } from '@/game/data/actions/fireball'
import { FireballRenderer } from './actions/fireball'

const ACTION_RENDERERS = {
  [Fireball.ID]: FireballRenderer,
}

export { ACTION_RENDERERS }
