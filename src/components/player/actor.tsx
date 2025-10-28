import type { SActor } from '@/game/state'
import { Atom } from 'lucide-react'
import { ItemContent, ItemTitle } from '../ui/item'
import { Progress } from '../ui/progress'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { MAIN_STAT_ICONS } from '@/renderers/icons'
import { getHealth } from '@/game/actor'
import { useGameState } from '@/hooks/useGameState'
import { getActorWithEffects } from '@/game/access'
import { Badge } from '../ui/badge'

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
  if (!actorID) {
    return (
      <Button
        disabled
        variant="outline"
        className="h-20 mb-4.5 mt-8 w-64 flex items-center justify-center text-muted-foreground border-dashed bg-muted/40"
      >
        inactive
      </Button>
    )
  }

  const [actor, effectIDs] = getActorWithEffects(state, actorID)!
  const [health, maxHealth] = getHealth(actor)
  const done = !!state.actionQueue.find((a) => a.context.sourceID === actorID)

  return (
    <div className="group relative flex flex-col justify-end w-64" {...rest}>
      <div className="flex transition-all justify-between h-6 -mb-2 mt-4 group-hover:mb-1 group-hover:mt-1 z-10">
        <div className="flex -space-x-3 group-hover:space-x-1 transition-all flex-wrap">
          {effectIDs
            .map((id) => state.effects.find((e) => e.effect.ID === id)!)
            .map((effect) => (
              <Badge
                key={effect.ID}
                variant="outline"
                className="bg-background text-muted-foreground"
              >
                {effect.effect.name}
              </Badge>
            ))}
        </div>
      </div>
      <Button
        variant={active ? 'default' : 'secondary'}
        disabled={disabled}
        className={cn('h-auto', '')}
        onClick={() => onClick(actor)}
      >
        <ItemContent>
          <ItemTitle>{actor.name}</ItemTitle>
          <Progress
            value={(health * 100) / maxHealth}
            indicator={{ className: cn({ 'bg-background': active }) }}
          />
          <Progress
            value={100}
            className="h-1"
            indicator={{
              className: cn({
                'bg-blue-800/60': active,
                'bg-blue-300': !active,
              }),
            }}
          />
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
              <MAIN_STAT_ICONS.intelligence />
              {actor.stats.intelligence}
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
  effects: Array<string>
  active: boolean
  onClick: () => void
}) {
  const [health, maxHealth] = getHealth(actor)
  return (
    <div className="group relative flex flex-col justify-end w-48" {...rest}>
      <div className="flex transition-all justify-between -mb-2 mt-4 group-hover:mb-1 group-hover:mt-1 z-10">
        <div className="flex -space-x-3 group-hover:space-x-1 transition-all flex-wrap">
          {effects.map((effect) => (
            <div
              key={effect}
              className="size-6 bg-background border-border border rounded-full text-muted-foreground transition-all [&>svg]:size-4 flex items-center justify-center"
            >
              <Atom />
            </div>
          ))}
        </div>
      </div>
      <Button
        variant={active ? 'default' : 'secondary'}
        className="h-auto"
        disabled
        onClick={onClick}
      >
        <ItemContent>
          <ItemTitle>{actor.name}</ItemTitle>
          <Progress
            value={(health * 100) / maxHealth}
            indicator={{ className: cn({ 'bg-background': active }) }}
          />
        </ItemContent>
      </Button>
    </div>
  )
}

export { Actor, EnemyActor }
