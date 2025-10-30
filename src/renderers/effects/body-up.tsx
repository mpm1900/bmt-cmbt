import { BodyUp } from '@/game/data/effects/body-up'
import type { EffectRenderer } from '.'

const BodyUpRenderer: EffectRenderer = {
  effectID: BodyUp.ID,
  Name: () => <>Body Up</>,
  Description: () => {
    return <>+50% Body</>
  },
}

export { BodyUpRenderer }
