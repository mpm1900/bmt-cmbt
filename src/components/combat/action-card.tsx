import { findActor } from '@/game/access'
import type { SAction } from '@/game/state'
import type { DeltaContext } from '@/game/types/delta'
import { useGameState } from '@/hooks/useGameState'
import { cn } from '@/lib/utils'
import { ACTION_RENDERERS } from '@/renderers'
import { ActionDetails } from '../tooltips/action-tooltip'
import { useEffect, useRef } from 'react'
import { useGameUI } from '@/hooks/useGameUI'

function ActionCard({
  action,
  context,
  active,
  disabled,
  onClick,
}: {
  action: SAction
  active: boolean
  context: DeltaContext
  disabled: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) {
  const state = useGameState((s) => s.state)
  const source = findActor(state, context.sourceID)
  const set = useGameUI((s) => s.set)
  const ref = useRef<HTMLButtonElement>(null)

  const renderer = ACTION_RENDERERS[action.ID]

  useEffect(() => {
    if (active) {
      set({ activeActionRef: ref as any as React.RefObject<HTMLDivElement> })
    }
  }, [active])

  return (
    <button
      ref={ref}
      disabled={disabled}
      onMouseDown={onClick}
      className={cn(
        'cursor-default user-select-none flex flex-col justify-start text-left !w-55 h-71 bg-neutral-950 border-2 border-neutral-700 ring ring-black shadow p-0 rounded-sm',
        {
          'hover:z-30 hover:shadow-[0px_16px_32px_16px_rgba(0,_0,_0,_0.2)] hover:-translate-y-6 transition-all':
            !disabled,
        },
        {
          'z-20 shadow-[0px_16px_32px_16px_rgba(0,_0,_0,_0.3)]! bg-neutral-900 border-neutral-700':
            active,
        },
        'disabled:opacity-50'
      )}
    >
      {renderer ? (
        <ActionDetails
          showImage
          renderer={renderer}
          cooldown={source?.cooldowns[action.ID]}
        />
      ) : (
        <span className="title text-xl p-2">{action.name}</span>
      )}
    </button>
  )
}

export { ActionCard }
