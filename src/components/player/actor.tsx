import type { SActor } from '@/game/state'
import { ItemContent, ItemTitle } from '../ui/item'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { MAIN_STAT_ICONS } from '@/renderers/icons'
import { getHealth } from '@/game/actor'
import { useGameState } from '@/hooks/useGameState'
import { getActorWithEffects } from '@/game/access'
import { Badge } from '../ui/badge'
import { EffectTooltip } from '../tooltips/effect-tooltip'
import { useState } from 'react'
import { ActorHealth } from './actor-health'

function Actor({
  actorID,
  active,
  disabled,
  status,
  onClick,
  ...rest
}: Omit<React.ComponentProps<'div'>, 'onClick'> & {
  actorID: string | null
  active: boolean
  disabled: boolean
  status: string
  onClick: (actor: SActor) => void
}) {
  const state = useGameState((s) => s.state)
  const [openTooltipCount, setOpenTooltipCount] = useState(0)

  if (!actorID) {
    return (
      <Button
        disabled
        variant="slate-inactive"
        className="h-20 mb-4.5 mt-8 w-64 flex items-center justify-center border border-foreground/10 border-dashed"
      ></Button>
    )
  }

  const [actor, effects] = getActorWithEffects(state, actorID)!
  const [health, maxHealth] = getHealth(actor)
  const done = !!state.actionQueue.find((a) => a.context.sourceID === actorID)

  return (
    <div
      className="group relative flex flex-col justify-end w-64"
      data-state={openTooltipCount > 0 ? 'open' : 'closed'}
      {...rest}
    >
      <div className="flex transition-all justify-between h-6 -mb-2 mt-4 group-hover:mb-1 group-hover:mt-1 group-data-[state=open]:mb-1 group-data-[state=open]:mt-1 z-10">
        <div className="flex -space-x-3 group-hover:space-x-1 group-data-[state=open]:space-x-1 transition-all flex-wrap">
          {Object.entries(effects)
            .map(
              ([id, count]) =>
                [state.effects.find((e) => e.effect.ID === id)!, count] as const
            )
            .map(([effect, count]) => (
              <EffectTooltip
                key={effect.ID}
                effectID={effect.effect.ID}
                side="top"
                asChild
                onOpenChange={(open) => {
                  setOpenTooltipCount((prev) => prev + (open ? 1 : -1))
                }}
              >
                <Badge
                  variant="outline"
                  className="bg-background text-muted-foreground"
                >
                  {effect.effect.name}
                  {count > 1 ? `(${count})` : ''}
                </Badge>
              </EffectTooltip>
            ))}
        </div>
      </div>
      <Button
        variant={active ? 'slate-active' : 'slate'}
        disabled={disabled}
        className={cn('h-auto p-2 pb-1')}
        onClick={() => onClick(actor)}
      >
        <ItemContent>
          <ItemTitle className="font-semibold">{actor.name}</ItemTitle>
          <ActorHealth active={active} value={(health * 100) / maxHealth} />

          <div className="flex gap-3">
            <div className="flex gap-1 items-center">
              <MAIN_STAT_ICONS.body />
              {actor.stats.body}
            </div>
            <div className="flex gap-1 items-center">
              <MAIN_STAT_ICONS.reflexes />
              {actor.stats.reflexes}
            </div>
            <div className="flex gap-1 items-center">
              <MAIN_STAT_ICONS.mind />
              {actor.stats.mind}
            </div>
          </div>
        </ItemContent>
      </Button>
      <span className="uppercase font-bold text-xs text-muted-foreground/40 text-center mt-1">
        {done ? '...' : status}
      </span>
    </div>
  )
}

function EnemyActor({
  actor,
  effects,
  active,
  onClick,
  ...rest
}: React.ComponentProps<'div'> & {
  actor: SActor
  effects: { [key: string]: number }
  active: boolean
  onClick: () => void
}) {
  const state = useGameState((s) => s.state)
  const [health, maxHealth] = getHealth(actor)
  const [openTooltipCount, setOpenTooltipCount] = useState(0)

  return (
    <div
      className="group flex flex-col w-48"
      {...rest}
      data-state={openTooltipCount > 0 ? 'open' : 'closed'}
    >
      <Button
        variant={active ? 'default' : 'stone'}
        className="min-h-14 h-auto py-1 px-2"
        disabled
        onClick={onClick}
      >
        <ItemContent>
          <ItemTitle>{actor.name}</ItemTitle>
          <ActorHealth active={active} value={(health * 100) / maxHealth} />
        </ItemContent>
      </Button>
      <div className="flex transition-all justify-between -mt-2 mb-4 group-hover:mt-1 group-hover:mb-1 group-data-[state=open]:mb-1 group-data-[state=open]:mt-1 z-10">
        <div className="flex -space-x-3 group-hover:space-x-1 group-data-[state=open]:space-x-1 transition-all flex-wrap">
          {Object.entries(effects)
            .map(
              ([id, count]) =>
                [state.effects.find((e) => e.effect.ID === id)!, count] as const
            )
            .map(([effect, count]) => (
              <EffectTooltip
                key={effect.ID}
                effectID={effect.effect.ID}
                side="bottom"
                asChild
                onOpenChange={(open) => {
                  setOpenTooltipCount((prev) => prev + (open ? 1 : -1))
                }}
              >
                <Badge
                  key={effect.ID}
                  variant="outline"
                  className="bg-background text-muted-foreground"
                >
                  {effect.effect.name}
                  {count > 1 ? `(${count})` : ''}
                </Badge>
              </EffectTooltip>
            ))}
        </div>
      </div>
    </div>
  )
}

export { Actor, EnemyActor }
