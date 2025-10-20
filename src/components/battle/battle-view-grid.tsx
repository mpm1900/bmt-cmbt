import { ArrowDownUp, Box, Component, MessageSquare } from 'lucide-react'
import { ButtonGrid } from '../button-grid'
import { Button } from '../ui/button'
import { useGameUI } from '@/hooks/useGameUI'
import { Swap } from '@/game/data/actions/swap'
import { useGameState } from '@/hooks/useGameState'
import { getActor } from '@/game/access'

function BattleViewGrid() {
  const { set, view, activeActorID } = useGameUI((s) => s)
  const state = useGameState((s) => s.state)
  const phase = state.battle?.phase
  const actor = getActor(state, activeActorID)
  const variant = (v: typeof view) => {
    if (phase === 'planning') {
      return view === v ? 'default' : 'secondary'
    }

    return 'secondary'
  }

  const disabled = !(phase === 'planning')
  return (
    <ButtonGrid className="grid grid-cols-2 grid-rows-2">
      <Button disabled variant="secondary" size="icon-lg">
        <MessageSquare />
      </Button>
      <Button
        variant={variant('items')}
        size="icon-lg"
        onClick={() => set({ view: 'items' })}
        disabled={disabled}
      >
        <Box />
      </Button>
      <Button
        variant={variant('actions')}
        size="icon-lg"
        onClick={() =>
          set({ view: 'actions', activeActionID: actor?.actions[0].ID })
        }
        disabled={disabled}
      >
        <Component />
      </Button>
      <Button
        variant={variant('switch')}
        size="icon-lg"
        onClick={() => set({ view: 'switch', activeActionID: Swap.ID })}
        disabled={disabled}
      >
        <ArrowDownUp />
      </Button>
    </ButtonGrid>
  )
}

export { BattleViewGrid }
