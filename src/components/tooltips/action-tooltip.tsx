import type { ActionRenderer } from '@/renderers/actions'
import { Collapsible, CollapsibleContent } from '../ui/collapsible'
import { ItemActions, ItemContent } from '../ui/item'
import { cn } from '@/lib/utils'
import { TfiTarget } from 'react-icons/tfi'
import { FaDiceD20 } from 'react-icons/fa'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { ACTION_RENDERERS } from '@/renderers'

function ActionDetails({
  renderer,
  active,
}: {
  renderer: ActionRenderer
  active: boolean
}) {
  return (
    <Collapsible open={active}>
      <ItemActions className={cn('flex-col items-end float-right pl-3', {})}>
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
      <ItemContent className="block">
        <span
          className={cn('inline-block text-base', {
            'mb-2': active,
            'text-muted-foreground': !active,
          })}
        >
          <renderer.Name />
        </span>
        <CollapsibleContent className="text-muted-foreground text-sm">
          <renderer.DescriptionShort />
        </CollapsibleContent>
      </ItemContent>
    </Collapsible>
  )
}

function ActionTooltip({
  className,
  align,
  alignOffset,
  side,
  actionID,
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof HoverCardTrigger> &
  Pick<
    React.ComponentProps<typeof HoverCardContent>,
    'align' | 'alignOffset' | 'side'
  > &
  Pick<React.ComponentProps<typeof HoverCard>, 'open' | 'onOpenChange'> & {
    actionID: string
  }) {
  const renderer = ACTION_RENDERERS[actionID]
  if (!renderer) return props.children

  return (
    <HoverCard
      openDelay={100}
      closeDelay={100}
      open={open}
      onOpenChange={onOpenChange}
    >
      <HoverCardTrigger
        className={cn('data-[state=open]:underline cursor-default', className)}
        {...props}
      />
      <HoverCardContent
        align={align}
        alignOffset={alignOffset}
        collisionPadding={8}
        side={side}
        sideOffset={8}
      >
        <ActionDetails renderer={renderer} active={true} />
      </HoverCardContent>
    </HoverCard>
  )
}

export { ActionDetails, ActionTooltip }
