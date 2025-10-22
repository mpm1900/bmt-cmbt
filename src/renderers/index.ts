import { Fireball } from '@/game/data/actions/fireball'
import { FireballRenderer } from './actions/fireball'
import { SprayNPray } from '@/game/data/actions/spray-n-pray'
import { SprayNPrayRenderer } from './actions/spray-n-pray'

const ACTION_RENDERERS = {
  [Fireball.ID]: FireballRenderer,
  [SprayNPray.ID]: SprayNPrayRenderer,
}

export { ACTION_RENDERERS }
