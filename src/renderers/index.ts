import { Fireball } from '@/game/data/actions/fireball'
import { FireballRenderer } from './actions/fireball'
import { MagicMissile } from '@/game/data/actions/magic-missile'
import { MagicMissileRenderer } from './actions/magic-missile'

const ACTION_RENDERERS = {
  [Fireball.ID]: FireballRenderer,
  [MagicMissile.ID]: MagicMissileRenderer,
}

export { ACTION_RENDERERS }
