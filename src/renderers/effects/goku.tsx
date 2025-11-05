import { Goku } from '@/game/data/effects/goku'
import type { EffectRenderer } from '.'
import { Effect } from '@/game/data/messages'
import { BodyUp } from '@/game/data/effects/body-up'
import { FaQuestionCircle } from 'react-icons/fa'

const GokuRenderer: EffectRenderer = {
  effectID: Goku.ID,
  Name: () => <>Goku</>,
  Description: () => <>On Damage: gain {Effect(BodyUp.ID, BodyUp.name)}</>,
  Icon: () => <FaQuestionCircle />,
}

export { GokuRenderer }
