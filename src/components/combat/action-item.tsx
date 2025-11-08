import { cn } from '@/lib/utils'
import { buttonVariants } from '../ui/button'
import type { SAction } from '@/game/state'
import { ACTION_RENDERERS } from '@/renderers'
import { Item } from '../ui/item'
import { useGameState } from '@/hooks/useGameState'
import type { DeltaPositionContext } from '@/game/types/delta'
import { ActionDetails } from '../tooltips/action-tooltip'

function ActionItem({
  action,
  context,
  active,
  onActiveChange,
}: {
  action: SAction
  context: DeltaPositionContext
  active: boolean
  onActiveChange: (active: boolean) => void
}) {
  const state = useGameState((s) => s.state)

  const disabled = context && !action.validate(state, context)
  const renderer = ACTION_RENDERERS[action.ID]
  return (
    <Item
      onClick={() => onActiveChange(!active)}
      className={cn(
        buttonVariants({
          variant: active ? 'outline-active' : 'outline',
        }),
        'whitespace-normal items-start h-auto cursor-default block',
        { 'opacity-50 pointer-events-none !cursor-not-allowed': disabled }
      )}
    >
      {renderer ? (
        <ActionDetails renderer={renderer} active={active} />
      ) : (
        <span className={cn('text-base', { 'text-muted-foreground': !active })}>
          {action.name}
        </span>
      )}
    </Item>
  )
}

export { ActionItem }
