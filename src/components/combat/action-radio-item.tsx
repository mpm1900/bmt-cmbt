import { cn } from '@/lib/utils'
import { buttonVariants } from '../ui/button'
import type { SAction } from '@/game/state'
import { ACTION_RENDERERS } from '@/renderers'
import { Item, ItemActions, ItemContent } from '../ui/item'
import { Collapsible, CollapsibleContent } from '../ui/collapsible'
import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'

function ActionRadioItem({
  action,
  active,
  onActiveChange,
}: {
  action: SAction
  active: boolean
  onActiveChange: (active: boolean) => void
}) {
  const state = useGameState((s) => s.state)
  const context = useGameUI((s) => s.stagingContext)
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
          <ItemActions className="flex-col items-end float-right pb-1">
            <div
              className={cn({
                'text-muted-foreground': !active,
              })}
            >
              <renderer.Icons />
            </div>
            <CollapsibleContent className="flex flex-col items-end">
              {renderer.Damage && <renderer.Damage />}
              {renderer.Critical && <renderer.Critical />}
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

export { ActionRadioItem }
