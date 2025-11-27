import { cn } from '@/lib/utils'
import type { SAction } from '@/game/state'
import { ACTION_RENDERERS } from '@/renderers'
import { Item } from '../ui/item'
import { useGameState } from '@/hooks/useGameState'
import type { DeltaContext } from '@/game/types/delta'
import { ActionDetails } from '../tooltips/action-tooltip'
import { validateAction } from '@/game/action'
import { findActor } from '@/game/access'

function ActionItem({
  action,
  context,
  active,
  onActiveChange,
}: {
  action: SAction
  context: DeltaContext
  active: boolean
  onActiveChange: (active: boolean) => void
}) {
  const state = useGameState((s) => s.state)
  const source = findActor(state, context.sourceID)

  const disabled = context && !validateAction(action, state, context)
  const renderer = ACTION_RENDERERS[action.ID]
  return (
    <Item
      onClick={() => onActiveChange(!active)}
      size="xs"
      variant={active ? 'action-active' : 'action'}
      className={cn('cursor-default rounded-sm', {
        'opacity-50 pointer-events-none !cursor-not-allowed': disabled,
      })}
    >
      {renderer ? (
        <ActionDetails
          renderer={renderer}
          cooldown={source?.cooldowns[action.ID]}
          showImage={false}
        />
      ) : (
        <span
          className={cn('text-xl title', {
            'text-muted-foreground': !active,
          })}
        >
          {action.name}
        </span>
      )}
    </Item>
  )
}

export { ActionItem }
