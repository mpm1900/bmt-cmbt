import {
  Fireball,
  FireballAccuracy,
  FireballCooldown,
  FireballDamage,
  FireballTargetCount,
} from '@/game/data/actions/fireball'
import type { ActionRenderer } from '.'
import { ActionSubDetails } from '@/components/tooltips/action-tooltip'
import img from '@/assets/spells/Fire Spell Pack25.png'
import {
  ActionBody,
  ActionCooldown,
  ActionDescription,
  ActionLabel,
  ActionTitle,
} from '@/components/ui/action-utils'
import { FaCircle } from 'react-icons/fa'

const FireballRenderer: ActionRenderer = {
  actionID: Fireball.ID,
  img,
  Name: () => <ActionTitle>Fireball</ActionTitle>,
  Cost: () => (
    <>
      <FaCircle />
      <FaCircle />
      <FaCircle />
      <FaCircle />
      <FaCircle />
    </>
  ),
  Body: () => (
    <ActionBody>
      <ActionSubDetails accuracy={FireballAccuracy} damage={FireballDamage} />
      <ActionDescription>
        Deals <ActionLabel>{FireballDamage.power}</ActionLabel>{' '}
        <ActionLabel variant="fire">fire</ActionLabel> damage to up to{' '}
        <ActionLabel>{FireballTargetCount}</ActionLabel> target enemies simul.{' '}
        <ActionCooldown>{FireballCooldown - 1}-turn cooldown.</ActionCooldown>
      </ActionDescription>
    </ActionBody>
  ),
}

export { FireballRenderer }
