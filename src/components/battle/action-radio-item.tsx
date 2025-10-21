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
        'whitespace-normal items-start h-auto cursor-default',
        { 'opacity-50 pointer-events-none !cursor-not-allowed': disabled }
      )}
    >
      <Collapsible open={active}>
        <ItemContent>
          <div className="flex items-center gap-2">
            <span className={cn({ 'text-muted-foreground': !active })}>
              {renderer ? <renderer.Name /> : action.name}
            </span>
          </div>
          {renderer && (
            <CollapsibleContent className="text-muted-foreground">
              <renderer.DescriptionShort />
            </CollapsibleContent>
          )}
        </ItemContent>
        {renderer && (
          <ItemActions className="flex-col items-end">
            <div
              className={cn({
                'text-muted-foreground': !active,
              })}
            >
              <renderer.Icons />
            </div>
            <CollapsibleContent className="flex flex-col items-end">
              <renderer.Damage />
              <renderer.Critical />
            </CollapsibleContent>
          </ItemActions>
        )}
      </Collapsible>
    </Item>
  )
}

export { ActionRadioItem }
