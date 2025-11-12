import { Activate, Swap } from '@/game/data/actions/_system/swap'
import type { ActionRenderer } from '.'

const ActivateRenderer: ActionRenderer = {
  actionID: Activate.ID,
  Icon: () => <></>,
  Name: () => <div className="">Activate Actor</div>,
  Body: () => 'Select an actor to fill the missing space in your active crew.',
  Stat: () => <></>,
}

const SwapRenderer: ActionRenderer = {
  actionID: Swap.ID,
  Icon: () => <></>,
  Name: () => <div className="">Swap Actors</div>,
  Stat: () => <></>,
  Body: () => 'Select an actor to switch places with this actor.',
}

export { ActivateRenderer, SwapRenderer }
