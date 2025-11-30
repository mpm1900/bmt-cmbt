import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { cn } from '@/lib/utils'
import { EFFECT_RENDERERS } from '@/renderers'
import type { EffectRenderer } from '@/renderers/effects'

function EffectDetails({ renderer }: { renderer: EffectRenderer }) {
  return (
    <>
      <div className="mb-2 px-2 bg-gradient-to-r from-neutral-600 via-transparent to-transparent">
        <span className="text-lg title -mt-2">
          <renderer.Name />
        </span>
      </div>
      <div className="text-xs p-2">
        <renderer.Description />
      </div>
    </>
  )
}

function EffectTooltip({
  className,
  align,
  alignOffset,
  side,
  effectID,
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof HoverCardTrigger> &
  Pick<
    React.ComponentProps<typeof HoverCardContent>,
    'align' | 'alignOffset' | 'side'
  > &
  Pick<React.ComponentProps<typeof HoverCard>, 'open' | 'onOpenChange'> & {
    effectID: string
  }) {
  const renderer = EFFECT_RENDERERS[effectID]
  if (!renderer) return props.children

  return (
    <HoverCard
      openDelay={100}
      closeDelay={100}
      open={open}
      onOpenChange={onOpenChange}
    >
      <HoverCardTrigger
        className={cn(
          'data-[state=open]:underline data-[state=open]:!border-ring cursor-default',
          className
        )}
        {...props}
      />
      <HoverCardContent
        align={align}
        alignOffset={alignOffset}
        collisionPadding={8}
        side={side}
        sideOffset={8}
        className="p-0"
      >
        <EffectDetails renderer={renderer} />
      </HoverCardContent>
    </HoverCard>
  )
}

export { EffectDetails, EffectTooltip }
