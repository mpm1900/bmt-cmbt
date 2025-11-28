import type { ActionRenderer } from '.'
import {
  SprayNPray,
  SprayNPrayAccuracy,
  SprayNPrayCooldown,
  SPrayNPrayCount,
  SprayNPrayCritChance,
  SprayNPrayDamage,
} from '@/game/data/actions/spray-n-pray'
import { ActionSubDetails } from '@/components/tooltips/action-tooltip'
import img from '@/assets/spells/Poison Spell85.png'
import {
  ActionBody,
  ActionCooldown,
  ActionDescription,
  ActionLabel,
  ActionTitle,
} from '@/components/ui/action-utils'

const SprayNPrayRenderer: ActionRenderer = {
  actionID: SprayNPray.ID,
  img,
  Name: () => <ActionTitle>Spray 'n Pray</ActionTitle>,
  Cost: () => <></>,
  Body: () => (
    <ActionBody>
      <ActionSubDetails
        accuracy={SprayNPrayAccuracy}
        critChance={SprayNPrayCritChance}
        damage={SprayNPrayDamage}
      />
      <ActionDescription>
        Deals <ActionLabel>{SprayNPrayDamage.power}</ActionLabel>{' '}
        <ActionLabel>{SprayNPrayDamage.element}</ActionLabel> damage to any
        other target <ActionLabel>{SPrayNPrayCount}</ActionLabel> times.{' '}
        <ActionCooldown>{SprayNPrayCooldown - 1}-turn cooldown.</ActionCooldown>
      </ActionDescription>
    </ActionBody>
  ),
}

export { SprayNPrayRenderer }
