import type { SActor } from '@/game/state'
import { ItemContent, ItemTitle } from '../ui/item'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { MAIN_STAT_ICONS } from '@/renderers/icons'
import { getHealth } from '@/game/actor'
import { useGameState } from '@/hooks/useGameState'
import { getActorWithEffects } from '@/game/access'
import { useState } from 'react'
import { ActorHealth } from './actor-health'
import { ActorStatus } from './actor-status'
import { EffectBadge } from '../effect-badge'

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
        className="h-20 mb-4.5 mt-5 w-64 flex items-center justify-center border border-foreground/10 border-dashed"
      />
    )
  }

  const [actor, effects] = getActorWithEffects(state, actorID)!
  const [health, maxHealth] = getHealth(actor)

  return (
    <div
      className="group relative flex flex-col justify-end w-64"
      data-state={openTooltipCount > 0 ? 'open' : 'closed'}
      {...rest}
    >
      <div className="flex transition-all justify-between h-6 translate-y-2 group-hover:-translate-y-1 group-data-[state=open]:-translate-y-1 z-10">
        <div className="flex -space-x-3 group-hover:space-x-1 group-data-[state=open]:space-x-1 transition-all flex-wrap">
          {Object.entries(effects)
            .map(
              ([id, count]) =>
                [state.effects.find((e) => e.effect.ID === id)!, count] as const
            )
            .map(([effect, count]) => (
              <EffectBadge
                key={effect.ID}
                effect={effect.effect}
                count={count}
                side="top"
                onOpenChange={(open) => {
                  setOpenTooltipCount((prev) => prev + (open ? 1 : -1))
                }}
              />
            ))}
        </div>
      </div>
      <Button
        variant={active ? 'slate-active' : 'slate'}
        disabled={disabled}
        className={cn('h-auto p-2 pb-1')}
        onClick={() => onClick(actor)}
      >
        <ItemContent className="gap-0">
          <ItemTitle className="font-semibold">{actor.name}</ItemTitle>
          <ActorHealth
            active={active}
            showHealthNumbers={true}
            health={health}
            maxHealth={maxHealth}
          />

          <div className="flex gap-3 mt-1">
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
      <ActorStatus actor={actor} />
    </div>
  )
}

function EnemyActor({
  actor,
  effects,
  active,
  targeted,
  onClick,
  ...rest
}: React.ComponentProps<'div'> & {
  actor: SActor
  effects: { [key: string]: number }
  active: boolean
  targeted: boolean
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
        variant={targeted ? 'destructive' : active ? 'default' : 'stone'}
        className="min-h-14 h-auto py-1 px-2"
        disabled
        onClick={onClick}
      >
        <ItemContent className="gap-0">
          <ItemTitle className="text-xs">{actor.name}</ItemTitle>
          <ActorHealth
            active={active}
            showHealthNumbers={false}
            health={health}
            maxHealth={maxHealth}
          />
        </ItemContent>
      </Button>
      <div className="flex transition-all justify-between h-6 -translate-y-2 group-hover:translate-y-1 group-data-[state=open]:translate-y-1 z-10">
        <div className="flex -space-x-3 group-hover:space-x-1 group-data-[state=open]:space-x-1 transition-all flex-wrap">
          {Object.entries(effects)
            .map(
              ([id, count]) =>
                [state.effects.find((e) => e.effect.ID === id)!, count] as const
            )
            .map(([effect, count]) => (
              <EffectBadge
                key={effect.ID}
                effect={effect.effect}
                count={count}
                onOpenChange={(open) => {
                  setOpenTooltipCount((prev) => prev + (open ? 1 : -1))
                }}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export { Actor, EnemyActor }
