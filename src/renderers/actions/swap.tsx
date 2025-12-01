import { Activate, Swap } from '@/game/data/actions/_system/swap'
import type { ActionRenderer } from '.'
import img from '@/assets/spells/Blue Ability_18.png'
import {
  ActionBody,
  ActionDescription,
  ActionTitle,
} from '@/components/ui/action-utils'

const ActivateRenderer: ActionRenderer = {
  actionID: Activate.ID,
  img,
  Name: () => <ActionTitle>Select Fighters</ActionTitle>,
  Cost: () => <></>,
  Body: ({ active }) => (
    <ActionBody active={active}>
      Select the fighter(s) to fill the missing space in your active party.'
    </ActionBody>
  ),
}

const SwapRenderer: ActionRenderer = {
  actionID: Swap.ID,
  img,
  Name: () => <div>Swap Fighters</div>,
  Cost: () => <></>,
  Body: ({ active }) => (
    <ActionBody active={active}>
      <ActionDescription className="pt-2">
        This fighter leaves combat and switches places with another inactive
        figher.
      </ActionDescription>
    </ActionBody>
  ),
}

export { ActivateRenderer, SwapRenderer }
