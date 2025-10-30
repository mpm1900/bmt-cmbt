import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { cn } from '@/lib/utils'
import { EFFECT_RENDERERS } from '@/renderers'

function EffectTooltip({
  className,
  align,
  alignOffset,
  side,
  effectID,
  ...props
}: React.ComponentProps<typeof HoverCardTrigger> &
  Pick<
    React.ComponentProps<typeof HoverCardContent>,
    'align' | 'alignOffset' | 'side'
  > & {
    effectID: string
  }) {
  const renderer = EFFECT_RENDERERS[effectID]
  if (!renderer) return props.children

  return (
    <HoverCard openDelay={50}>
      <HoverCardTrigger
        className={cn('data-[state=open]:underline cursor-default', className)}
        {...props}
      />
      <HoverCardContent align={align} alignOffset={alignOffset} side={side}>
        <p className="font-bold">
          <renderer.Name />
        </p>
        <p className="font-xs">
          <renderer.Description />
        </p>
      </HoverCardContent>
    </HoverCard>
  )
}

export { EffectTooltip }
