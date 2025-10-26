import { Activate, Swap } from '@/game/data/actions/_system/swap'
import type { ActionRenderer } from '.'

const ActivateRenderer: ActionRenderer = {
  actionID: Activate.ID,
  Name: () => <div className="">Activate Actor</div>,
  DescriptionShort: () =>
    'Select an actor to fill the missing space in your active crew.',
  Icons: () => <></>,
}

const SwapRenderer: ActionRenderer = {
  actionID: Swap.ID,
  Name: () => <div className="">Swap Actors</div>,
  DescriptionShort: () => 'Select an actor to switch places with this actor.',
  Icons: () => <></>,
}

export { ActivateRenderer, SwapRenderer }
