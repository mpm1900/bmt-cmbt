import { Activate, Swap } from '@/game/data/actions/_system/swap'
import type { ActionRenderer } from '.'
import img from '@/assets/spells/Blue Ability_18.png'

const ActivateRenderer: ActionRenderer = {
  actionID: Activate.ID,
  img,
  Icon: () => <></>,
  Name: () => <div className="">Select Fighters</div>,
  Body: () =>
    'Select the fighter(s) to fill the missing space in your active party.',
  Stat: () => <></>,
}

const SwapRenderer: ActionRenderer = {
  actionID: Swap.ID,
  img,
  Icon: () => <></>,
  Name: () => <div>Swap Fighters</div>,
  Stat: () => <></>,
  Body: () => (
    <div className="flex flex-col gap-1">
      <span className="p-2">Select an fighter to switch places.</span>
    </div>
  ),
}

export { ActivateRenderer, SwapRenderer }
