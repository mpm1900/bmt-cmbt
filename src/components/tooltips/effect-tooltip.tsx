import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { cn } from '@/lib/utils'
import { EFFECT_RENDERERS } from '@/renderers'
import type { EffectRenderer } from '@/renderers/effects'

function EffectDetails({ renderer }: { renderer: EffectRenderer }) {
  return (
    <>
      <p className="text-lg title mb-2">
        <renderer.Name />
      </p>
      <p className="text-xs">
        <renderer.Description />
      </p>
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
        <EffectDetails renderer={renderer} />
      </HoverCardContent>
    </HoverCard>
  )
}

export { EffectDetails, EffectTooltip }
