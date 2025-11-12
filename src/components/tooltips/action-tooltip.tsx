import type { ActionRenderer } from '@/renderers/actions'
import { Collapsible, CollapsibleContent } from '../ui/collapsible'
import { ItemActions, ItemContent } from '../ui/item'
import { cn } from '@/lib/utils'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { ACTION_RENDERERS } from '@/renderers'
import { Clock } from 'lucide-react'
import { MAIN_STAT_ICONS } from '@/renderers/icons'
import type { PowerDamage } from '@/game/types/damage'
import { TfiTarget } from 'react-icons/tfi'
import { TbMathFunction } from 'react-icons/tb'
import { FaDiceD20 } from 'react-icons/fa'
import { Separator } from '../ui/separator'

function ActionSubDetails({
  damage,
  accuracy,
  critChance,
  cooldown,
}: {
  damage?: PowerDamage
  accuracy?: number
  critChance?: number
  cooldown?: number
}) {
  const OStatIcon = damage ? MAIN_STAT_ICONS[damage.offenseStat] : undefined
  const DStatIcon = damage ? MAIN_STAT_ICONS[damage.defenseStat] : undefined

  return (
    <div className="flex flex-row gap-2 h-4 opacity-60">
      {damage && (
        <>
          <div className="text-xs inline-flex items-center gap-1">
            <TbMathFunction className="size-3.5" /> ={' '}
            {OStatIcon && <OStatIcon className="size-3.5 text-ally" />}
            {' / '}
            {DStatIcon && <DStatIcon className="size-3.5 text-enemy" />}
          </div>
          <Separator orientation="vertical" className="bg-foreground/10" />
        </>
      )}
      {accuracy && (
        <>
          <div className="text-xs inline-flex items-center gap-1">
            <TfiTarget className="size-3.5" />
            <span>{accuracy}%</span>
          </div>
          <Separator orientation="vertical" className="bg-foreground/10" />
        </>
      )}
      {critChance && damage?.criticalModifier && (
        <>
          <div className="text-xs inline-flex items-center gap-1 text-critical/60">
            <FaDiceD20 className="size-3.5" />
            <span>
              {critChance}% x{damage.criticalModifier}
            </span>
          </div>
          <Separator orientation="vertical" className="bg-foreground/10" />
        </>
      )}
      {cooldown && (
        <>
          <div className="text-xs inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            <span>
              {cooldown - 1} turn{cooldown > 2 && 's'}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

function ActionDetails({
  renderer,
  active,
  cooldown = 0,
}: {
  renderer: ActionRenderer
  active: boolean
  cooldown: number | undefined
}) {
  return (
    <Collapsible open={active}>
      <ItemActions
        className={cn('flex items-center float-right gap-1 h-4 pt-1', {})}
      >
        <renderer.Stat />
      </ItemActions>
      <ItemContent className="block">
        <span
          className={cn('inline-flex items-center gap-2 title text-xl', {
            'mb-3': active,
            'text-muted-foreground': !active,
          })}
        >
          <renderer.Icon />
          <renderer.Name />
          {cooldown > 0 && <Clock className="opacity-60" />}
        </span>
        <CollapsibleContent className="text-muted-foreground text-sm">
          <renderer.Body />
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
        <ActionDetails renderer={renderer} active={true} cooldown={0} />
      </HoverCardContent>
    </HoverCard>
  )
}

export { ActionSubDetails, ActionDetails, ActionTooltip }
