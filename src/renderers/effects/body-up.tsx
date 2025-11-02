import { BodyUp } from '@/game/data/effects/body-up'
import type { EffectRenderer } from '.'
import { BicepsFlexed } from 'lucide-react'

const BodyUpRenderer: EffectRenderer = {
  effectID: BodyUp.ID,
  Name: () => <>Body Up</>,
  Description: () => {
    return <>+50% Body</>
  },
  Icon: () => <BicepsFlexed className="text-green-200" />,
}

export { BodyUpRenderer }
