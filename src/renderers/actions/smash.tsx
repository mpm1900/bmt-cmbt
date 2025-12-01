import {
  Smash,
  SmashAccuracy,
  SmashCritChance,
  SmashDamage,
} from '@/game/data/actions/smash'
import type { ActionRenderer } from '.'
import img from '@/assets/spells/Wind_Smash.png'
import {
  ActionBody,
  ActionDescription,
  ActionLabel,
  ActionTitle,
} from '@/components/ui/action-utils'
import { ActionSubDetails } from '@/components/tooltips/action-tooltip'

const SmashRenderer: ActionRenderer = {
  actionID: Smash.ID,
  img,
  Name: () => <ActionTitle>Smash</ActionTitle>,
  Cost: () => null,
  Body: ({ active }) => (
    <ActionBody active={active}>
      <ActionSubDetails
        accuracy={SmashAccuracy}
        damage={SmashDamage}
        critChance={SmashCritChance}
      />
      <ActionDescription>
        Deals <ActionLabel>{SmashDamage.power}</ActionLabel>{' '}
        <ActionLabel>{SmashDamage.element}</ActionLabel> damage to target enemy.
      </ActionDescription>
    </ActionBody>
  ),
}

export { SmashRenderer }
