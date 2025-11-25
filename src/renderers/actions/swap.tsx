import { Activate, Swap } from '@/game/data/actions/_system/swap'
import type { ActionRenderer } from '.'

const ActivateRenderer: ActionRenderer = {
  actionID: Activate.ID,
  Icon: () => <></>,
  Name: () => <div className="">Select Fighters</div>,
  Body: () =>
    'Select a fighter to fill the missing space in your active party.',
  Stat: () => <></>,
}

const SwapRenderer: ActionRenderer = {
  actionID: Swap.ID,
  Icon: () => <></>,
  Name: () => <div className="">Swap Actors</div>,
  Stat: () => <></>,
  Body: () => 'Select an fighter to switch places.',
}

export { ActivateRenderer, SwapRenderer }
