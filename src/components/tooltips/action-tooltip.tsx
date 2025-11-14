import type { ActionRenderer } from '@/renderers/actions'
import { Collapsible, CollapsibleContent } from '../ui/collapsible'
import { ItemActions, ItemContent } from '../ui/item'
import { cn } from '@/lib/utils'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { ACTION_RENDERERS } from '@/renderers'
import { Clock, Slash } from 'lucide-react'
import { MAIN_STAT_ICONS } from '@/renderers/icons'
import type { PowerDamage } from '@/game/types/damage'
import { TfiTarget } from 'react-icons/tfi'
import { TbMathFunction } from 'react-icons/tb'
import { FaDiceD20 } from 'react-icons/fa'

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
    <div className="flex flex-row gap-4 h-5 p-0.5 self-center bg-black/60 px-3 rounded-full">
      {damage && (
        <>
          <div className="text-xs inline-flex items-center gap-1 whitespace-nowrap">
            {OStatIcon && <OStatIcon className="size-3.5 text-ally" />}
            <Slash className="size-3" />
            {DStatIcon && <DStatIcon className="size-3.5 text-enemy" />}
          </div>
        </>
      )}
      {accuracy && (
        <>
          <div className="text-xs inline-flex items-center gap-1 whitespace-nowrap">
            <TfiTarget className="size-3.5" />
            <span>{accuracy}%</span>
          </div>
        </>
      )}
      {critChance && damage?.criticalModifier && (
        <>
          <div className="text-xs inline-flex items-center gap-1 text-critical/60 whitespace-nowrap">
            <FaDiceD20 className="size-3.5" />
            <span>
              {critChance}% x{damage.criticalModifier}
            </span>
          </div>
        </>
      )}
      {cooldown && (
        <>
          <div className="text-xs inline-flex items-center gap-1 whitespace-nowrap">
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
    <Collapsible open={active} className="flex-1">
      <ItemActions
        className={cn('flex items-center float-right gap-1 h-4 pt-1', {})}
      ></ItemActions>
      <ItemContent className="block">
        <span
          className={cn('w-full inline-flex items-center gap-2 title text-xl', {
            'mb-3': active,
            'text-muted-foreground': !active,
          })}
        >
          <renderer.Icon />
          <renderer.Name />
          {cooldown > 0 && <Clock className="opacity-60" />}
          <div className="flex-1" />
          <renderer.Stat />
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
        className="w-76"
      >
        <ActionDetails renderer={renderer} active={true} cooldown={0} />
      </HoverCardContent>
    </HoverCard>
  )
}

export { ActionSubDetails, ActionDetails, ActionTooltip }
