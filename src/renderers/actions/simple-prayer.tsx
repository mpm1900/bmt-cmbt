import type { ActionRenderer } from '.'
import img from '@/assets/spells/Celestial spell_28.png'
import {
  ActionBody,
  ActionDescription,
  ActionLabel,
  ActionTitle,
} from '@/components/ui/action-utils'
import { ActionSubDetails } from '@/components/tooltips/action-tooltip'
import {
  SimplePrayer,
  SimplePrayerAccuracy,
  SimplePrayerDamage,
  SimplePrayerHealing,
} from '@/game/data/actions/simple-prayer'

const SimplePrayerRenderer: ActionRenderer = {
  actionID: SimplePrayer.ID,
  img,
  Name: () => <ActionTitle>Simple Prayer</ActionTitle>,
  Cost: () => null,
  Body: ({ active }) => (
    <ActionBody active={active}>
      <ActionSubDetails
        accuracy={SimplePrayerAccuracy}
        damage={SimplePrayerDamage}
        critChance={0}
      />
      <ActionDescription>
        Deals <ActionLabel>{SimplePrayerDamage.power}</ActionLabel>{' '}
        <ActionLabel variant={'fire'}>{SimplePrayerDamage.element}</ActionLabel>{' '}
        damage to target enemy OR heals target ally for{' '}
        <ActionLabel>{SimplePrayerHealing}%</ActionLabel>.
      </ActionDescription>
    </ActionBody>
  ),
}

export { SimplePrayerRenderer }
