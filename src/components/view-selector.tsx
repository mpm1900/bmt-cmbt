import { ArrowDownUp, Box, Component, MessageSquare } from 'lucide-react'
import { ButtonGrid } from './button-grid'
import { Button } from './ui/button'
import { useGameUI } from '@/hooks/useGameUI'
import { Swap } from '@/game/data/actions/_system/swap'
import { useGameState } from '@/hooks/useGameState'
import { getActor, nextAvailableAction } from '@/game/access'

function ViewSelector() {
  const { set, view, activeActorID } = useGameUI((s) => s)
  const state = useGameState((s) => s.state)
  const phase = state.combat?.phase
  const actor = getActor(state, activeActorID)
  const isPlanning = phase === 'planning'

  return (
    <ButtonGrid className="grid grid-cols-2 grid-rows-2">
      <Button
        variant={view === 'dialog' ? 'default' : 'secondary'}
        size="icon-lg"
        disabled={!!state.combat}
        onClick={() => set({ view: 'dialog' })}
      >
        <MessageSquare />
      </Button>
      <Button
        variant={view === 'items' ? 'default' : 'secondary'}
        size="icon-lg"
        onClick={() => set({ view: 'items' })}
        disabled={!isPlanning}
      >
        <Box />
      </Button>
      <Button
        variant={view === 'actions' ? 'default' : 'secondary'}
        size="icon-lg"
        onClick={() =>
          set({
            view: 'actions',
            activeActionID: nextAvailableAction(actor, state)?.ID,
          })
        }
        disabled={!isPlanning}
      >
        <Component />
      </Button>
      <Button
        variant={view === 'switch' ? 'default' : 'secondary'}
        size="icon-lg"
        onClick={() => set({ view: 'switch', activeActionID: Swap.ID })}
        disabled={!isPlanning}
      >
        <ArrowDownUp />
      </Button>
    </ButtonGrid>
  )
}

export { ViewSelector }
