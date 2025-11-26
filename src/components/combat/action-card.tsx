import { findActor } from '@/game/access'
import { validateAction } from '@/game/action'
import type { SAction } from '@/game/state'
import type { DeltaContext } from '@/game/types/delta'
import { useGameState } from '@/hooks/useGameState'
import { cn } from '@/lib/utils'
import { ACTION_RENDERERS } from '@/renderers'
import { ActionDetails } from '../tooltips/action-tooltip'

function ActionCard({
  action,
  context,
  active,
  onClick,
}: {
  action: SAction
  context: DeltaContext
  active: boolean
  onClick: () => void
}) {
  const state = useGameState((s) => s.state)
  const source = findActor(state, context.sourceID)

  const disabled = context && !validateAction(action, state, context)
  const renderer = ACTION_RENDERERS[action.ID]

  return (
    <button
      onClick={onClick}
      className={cn(
        'cursor-default user-select-none flex flex-col justify-start text-left !w-65 h-91 bg-neutral-900 border border-neutral-800 ring ring-black shadow p-2 rounded-sm',
        'hover:z-30 hover:shadow-[0px_16px_32px_16px_rgba(0,_0,_0,_0.2)] hover:-translate-y-6 transition-all',
        {
          'z-20 -translate-y-11! shadow-[0px_16px_32px_16px_rgba(0,_0,_0,_0.3)]! bg-neutral-800 border-neutral-600':
            active,
        }
      )}
    >
      {renderer ? (
        <ActionDetails
          renderer={renderer}
          active={true}
          cooldown={source?.cooldowns[action.ID]}
        />
      ) : (
        <span className="title text-xl">{action.name}</span>
      )}
    </button>
  )
}

export { ActionCard }
