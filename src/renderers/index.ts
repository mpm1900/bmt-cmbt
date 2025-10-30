import { Fireball } from '@/game/data/actions/fireball'
import { FireballRenderer } from './actions/fireball'
import { SprayNPray } from '@/game/data/actions/spray-n-pray'
import { SprayNPrayRenderer } from './actions/spray-n-pray'
import { Activate, Swap } from '@/game/data/actions/_system/swap'
import { ActivateRenderer, SwapRenderer } from './actions/swap'
import { BodyUp } from '@/game/data/effects/body-up'
import { BodyUpRenderer } from './effects/body-up'
import { Goku } from '@/game/data/effects/goku'
import { GokuRenderer } from './effects/goku'
import { BodyDown } from '@/game/data/effects/body-down'
import { BodyDownRenderer } from './effects/body-down'

const ACTION_RENDERERS = {
  [Activate.ID]: ActivateRenderer,
  [Swap.ID]: SwapRenderer,

  [Fireball.ID]: FireballRenderer,
  [SprayNPray.ID]: SprayNPrayRenderer,
}

const EFFECT_RENDERERS = {
  [BodyDown.ID]: BodyDownRenderer,
  [BodyUp.ID]: BodyUpRenderer,
  [Goku.ID]: GokuRenderer,
}

export { ACTION_RENDERERS, EFFECT_RENDERERS }
