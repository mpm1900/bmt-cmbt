import type { SActor } from '@/game/state'
import { useGameState } from '@/hooks/useGameState'
import { Trash2 } from 'lucide-react'

function ActorStatus({ actor }: { actor: SActor }) {
  const state = useGameState((s) => s.state)
  const cancel = useGameState((s) => s.filterAction)
  const queuedAction = state.actionQueue.find(
    (a) => a.context.sourceID === actor.ID
  )
  return (
    <span className="uppercase font-bold text-xs text-muted-foreground/40 text-center mt-1">
      {queuedAction ? (
        <span
          className="inline-flex items-center gap-1 hover:text-foreground/60 cursor-pointer hover:underline"
          onClick={() => {
            cancel(actor.ID)
          }}
        >
          Cancel Action <Trash2 className="size-3" />
        </span>
      ) : (
        <span className="opacity-0">...</span>
      )}
    </span>
  )
}

export { ActorStatus }
