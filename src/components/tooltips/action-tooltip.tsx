import type { ActionRenderer } from '@/renderers/actions'
import { ItemContent } from '../ui/item'
import { cn } from '@/lib/utils'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { ACTION_RENDERERS } from '@/renderers'
import { Clock, Slash } from 'lucide-react'
import { MAIN_STAT_ICONS } from '@/renderers/icons'
import type { PowerDamage } from '@/game/types/damage'
import { TfiTarget } from 'react-icons/tfi'
import { FaDiceD20 } from 'react-icons/fa'
import { ActionCost, ActionHeader } from '../ui/action-utils'
import type { ComponentProps } from 'react'

function ActionSubDetails({
  damage,
  accuracy,
  critChance,
}: {
  damage?: PowerDamage
  accuracy?: number
  critChance?: number
}) {
  const OStatIcon = damage ? MAIN_STAT_ICONS[damage.offenseStat] : undefined
  const DStatIcon = damage ? MAIN_STAT_ICONS[damage.defenseStat] : undefined

  return (
    <div
      className="flex flex-row justify-center gap-4 h-5 p-0.5 shadow-sm bg-black px-2 border border-l-black border-r-black w-[calc(100%+4px)] -ml-0.5"
      style={{ boxShadow: '0px 1px 5px black' }}
    >
      {accuracy && (
        <>
          <div className="text-xs inline-flex items-center gap-1 whitespace-nowrap">
            <TfiTarget className="size-3.5" />
            <span>{accuracy}%</span>
          </div>
        </>
      )}
      {damage && (
        <>
          <div className="text-xs inline-flex items-center gap-1 whitespace-nowrap">
            {OStatIcon && <OStatIcon className="size-3.5 text-ally" />}
            <Slash className="size-3" />
            {DStatIcon && <DStatIcon className="size-3.5 text-enemy" />}
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
    </div>
  )
}

function ActionDetails({
  active,
  renderer,
  cooldown = 0,
  showImage,
  className,
  ...props
}: ComponentProps<typeof ItemContent> & {
  active: boolean
  renderer: ActionRenderer
  cooldown: number | undefined
  showImage: boolean
}) {
  return (
    <ItemContent
      className={cn('flex relative h-full gap-0', className)}
      {...props}
    >
      <ActionHeader>
        {cooldown > 0 && <Clock className="opacity-60" />}
        <renderer.Name />
        <div className="flex-1" />
        <ActionCost>
          <renderer.Cost />
        </ActionCost>
      </ActionHeader>
      {showImage && (
        <div
          className="h-3/5 overflow-hidden -mt-7 z-0"
          style={{
            imageRendering: 'pixelated',
            backgroundImage: `url(${renderer.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        ></div>
      )}
      <renderer.Body active={active} />
    </ItemContent>
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
        className="w-76 border-0 ring-0 bg-transparent"
      >
        <ActionDetails
          active={true}
          renderer={renderer}
          cooldown={0}
          showImage={false}
          className="bg-muted border-ring border-1 ring ring-black rounded-t-md rounded-b-xs shadow-2xl"
        />
      </HoverCardContent>
    </HoverCard>
  )
}

export { ActionSubDetails, ActionDetails, ActionTooltip }
