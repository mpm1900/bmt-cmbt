import { Activate, Swap } from '@/game/data/actions/_system/swap'
import type { ActionRenderer } from '.'
import img from '@/assets/spells/Blue Ability_18.png'

const ActivateRenderer: ActionRenderer = {
  actionID: Activate.ID,
  img,
  Icon: () => <></>,
  Name: () => <div className="">Select Fighters</div>,
  Body: () =>
    'Select a fighter to fill the missing space in your active party.',
  Stat: () => <></>,
}

const SwapRenderer: ActionRenderer = {
  actionID: Swap.ID,
  img,
  Icon: () => <></>,
  Name: () => <div>Swap Actors</div>,
  Stat: () => <></>,
  Body: () => <span className="p-2">Select an fighter to switch places.</span>,
}

export { ActivateRenderer, SwapRenderer }
