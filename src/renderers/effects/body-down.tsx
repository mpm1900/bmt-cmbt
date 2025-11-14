import { BicepsFlexed } from 'lucide-react'
import type { EffectRenderer } from '.'
import { BodyDown } from '@/game/data/effects/body-down'

const BodyDownRenderer: EffectRenderer = {
  effectID: BodyDown.ID,
  Name: () => <>Strength Down</>,
  Description: () => {
    return <>-50% Strength</>
  },
  Icon: () => <BicepsFlexed className="text-red-200" />,
}

export { BodyDownRenderer }
