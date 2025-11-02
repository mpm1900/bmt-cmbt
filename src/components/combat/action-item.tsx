import { cn } from '@/lib/utils'
import { buttonVariants } from '../ui/button'
import type { SAction } from '@/game/state'
import { ACTION_RENDERERS } from '@/renderers'
import { Item, ItemActions, ItemContent } from '../ui/item'
import { Collapsible, CollapsibleContent } from '../ui/collapsible'
import { useGameState } from '@/hooks/useGameState'
import { FaDiceD20 } from 'react-icons/fa6'
import type { DeltaPositionContext } from '@/game/types/delta'
import { TfiTarget } from 'react-icons/tfi'

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
      asChild
      onClick={() => onActiveChange(!active)}
      className={cn(
        buttonVariants({
          variant: active ? 'outline-active' : 'outline',
        }),
        'whitespace-normal items-start h-auto cursor-default block',
        { 'opacity-50 pointer-events-none !cursor-not-allowed': disabled }
      )}
    >
      <Collapsible open={active}>
        {renderer && (
          <ItemActions
            className={cn('flex-col items-end float-right pl-3', {
              'pb-2': active,
            })}
          >
            <div
              className={cn({
                'text-muted-foreground': !active,
              })}
            >
              <renderer.Icons />
            </div>
            <CollapsibleContent className="flex flex-col items-end text-muted-foreground font-mono">
              {renderer.Accuracy && (
                <div className="flex items-center gap-1 font-black">
                  <TfiTarget className="size-3.5" />
                  <renderer.Accuracy />
                </div>
              )}
              {renderer.Critical && (
                <div className="flex items-center gap-1 opacity-60">
                  <FaDiceD20 className="size-3.5" />
                  <renderer.Critical />
                </div>
              )}
            </CollapsibleContent>
          </ItemActions>
        )}
        <ItemContent className="block">
          <span
            className={cn('inline-block', {
              'mb-2': active,
              'text-muted-foreground': !active,
            })}
          >
            {renderer ? <renderer.Name /> : action.name}
          </span>
          {renderer && (
            <CollapsibleContent className="text-muted-foreground">
              <renderer.DescriptionShort />
            </CollapsibleContent>
          )}
        </ItemContent>
      </Collapsible>
    </Item>
  )
}

export { ActionItem }
