import type { SActor } from '@/game/state'
import { Atom } from 'lucide-react'
import { ItemContent, ItemTitle } from '../ui/item'
import { Progress } from '../ui/progress'
import { getHealth } from '@/game/actor'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

function Actor({
  actor,
  active,
  disabled,
  effects,
  status,
  onClick,
  ...rest
}: React.ComponentProps<'div'> & {
  actor: SActor
  effects: Array<string>
  active: boolean
  disabled: boolean
  status: string
  onClick: () => void
}) {
  return (
    <div className="group relative flex flex-col justify-end w-64" {...rest}>
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
        disabled={disabled}
        className={cn('h-auto', '')}
        onClick={() => onClick()}
      >
        <ItemContent>
          <ItemTitle>{actor.name}</ItemTitle>
          <Progress
            value={
              ((getHealth(actor) - actor.state.damage) * 100) / getHealth(actor)
            }
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
          <pre>{actor.stats.body}</pre>
        </ItemContent>
      </Button>
      <span className="uppercase font-bold text-sm text-muted-foreground/40 text-center">
        {status}
      </span>
    </div>
  )
}

export { Actor }
