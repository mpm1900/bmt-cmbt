import { Box, Component, MessageSquare } from 'lucide-react'
import { ButtonGrid } from './button-grid'
import { Button } from './ui/button'
import { useGameUI, GameUIViews } from '@/hooks/useGameUI'
import { Swap } from '@/game/data/actions/_system/swap'
import { useGameState } from '@/hooks/useGameState'
import { getActor, nextAvailableAction } from '@/game/access'
import { hasNext } from '@/game/next'
import type { CombatPhase } from '@/game/types/combat'
import type { ComponentProps } from 'react'
import { AiOutlineUserSwitch } from 'react-icons/ai'

function getVariant(
  target: (typeof GameUIViews)[number],
  view: (typeof GameUIViews)[number],
  phase: CombatPhase | undefined
): ComponentProps<typeof Button>['variant'] {
  if (!phase) {
    if (target === view) {
      return 'default'
    }
  }

  if (phase === 'planning') {
    if (target === view) {
      return 'default'
    }
  }
  return 'ghost'
}

function ViewSelector() {
  const { set, view, activeActorID } = useGameUI((s) => s)
  const state = useGameState((s) => s.state)
  const phase = state.combat?.phase
  const actor = getActor(state, activeActorID)
  const planning = phase === 'planning'
  const running = !planning && hasNext(state)

  return (
    <ButtonGrid className="grid grid-cols-2 grid-rows-2">
      <Button
        variant={getVariant('dialog', view, phase)}
        size="icon-lg"
        disabled={!!state.combat || running}
        onClick={() => set({ view: 'dialog' })}
      >
        <MessageSquare />
      </Button>
      <Button
        variant={getVariant('items', view, phase)}
        size="icon-lg"
        onClick={() => set({ view: 'items' })}
        disabled={(state.combat && !planning) || running}
      >
        <Box />
      </Button>
      <Button
        variant={getVariant('actions', view, phase)}
        size="icon-lg"
        onClick={() =>
          set({
            view: 'actions',
            activeActionID: nextAvailableAction(actor, state)?.ID,
          })
        }
        disabled={!planning || running}
      >
        <Component />
      </Button>
      <Button
        variant={getVariant('switch', view, phase)}
        size="icon-lg"
        onClick={() => set({ view: 'switch', activeActionID: Swap.ID })}
        disabled={!planning || running}
      >
        <AiOutlineUserSwitch className="size-5" />
      </Button>
    </ButtonGrid>
  )
}

export { ViewSelector }
