import { Fireball } from '@/game/data/actions/fireball'
import { FireballRenderer } from './actions/fireball'
import { SprayNPray } from '@/game/data/actions/spray-n-pray'
import { SprayNPrayRenderer } from './actions/spray-n-pray'
import { Activate, Swap } from '@/game/data/actions/_system/swap'
import { ActivateRenderer, SwapRenderer } from './actions/swap'

const ACTION_RENDERERS = {
  [Activate.ID]: ActivateRenderer,
  [Swap.ID]: SwapRenderer,

  [Fireball.ID]: FireballRenderer,
  [SprayNPray.ID]: SprayNPrayRenderer,
}

export { ACTION_RENDERERS }
