import type { SActor } from '@/game/state'
import { useGameState } from '@/hooks/useGameState'
import { Undo2 } from 'lucide-react'
import { Button } from '../ui/button'
import type { ComponentProps } from 'react'

function ActorStatus({
  actor,
  ...props
}: ComponentProps<typeof Button> & { actor: SActor }) {
  const state = useGameState((s) => s.state)
  const cancel = useGameState((s) => s.filterAction)
  const queuedAction = state.actionQueue.find(
    (a) => a.context.sourceID === actor.ID
  )
  if (!queuedAction) return null
  return (
    <Button
      size="icon-xs"
      variant="destructive"
      onClick={() => cancel(queuedAction.context.sourceID)}
      {...props}
    >
      <Undo2 className="size-4" />
    </Button>
  )
}

export { ActorStatus }
