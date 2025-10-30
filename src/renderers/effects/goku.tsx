import { Goku } from '@/game/data/effects/goku'
import type { EffectRenderer } from '.'
import { Effect } from '@/game/data/messages'
import { BodyUp } from '@/game/data/effects/body-up'

const GokuRenderer: EffectRenderer = {
  effectID: Goku.ID,
  Name: () => <>Goku</>,
  Description: () => <>On Damage: gain {Effect(BodyUp)}</>,
}

export { GokuRenderer }
