import type { SActor } from '@/game/state'
import { Atom, EllipsisVertical } from 'lucide-react'
import { InputGroupButton } from '../ui/input-group'
import { Item, ItemContent, ItemTitle } from '../ui/item'
import { Progress } from '../ui/progress'
import { getHealth } from '@/game/actor'
import { Button, buttonVariants } from '../ui/button'
import { cn } from '@/lib/utils'

function Actor({
  actor,
  active,
  disabled,
  effects,
  onClick,
  ...rest
}: React.ComponentProps<'div'> & {
  actor: SActor
  effects: Array<string>
  active: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <div className="group relative flex flex-col justify-end w-64" {...rest}>
      <div className="flex transition-all justify-between -mb-2 mt-4 group-hover:mb-1 group-hover:-mt-2 z-10">
        <div className="flex -space-x-3 group-hover:space-x-1 transition-all flex-wrap">
          {effects.map((effect) => (
            <InputGroupButton
              key={effect}
              variant="outline"
              size="icon-xs"
              className="rounded-full transition-all"
            >
              <Atom />
            </InputGroupButton>
          ))}
        </div>
        <InputGroupButton
          variant="outline"
          size="icon-xs"
          className="rounded-full transition-all"
        >
          <EllipsisVertical />
        </InputGroupButton>
      </div>
      <Button
        variant={active ? 'outline-active' : 'outline'}
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
          />
          <Progress
            value={100}
            className="h-1"
            indicator={{ className: 'bg-blue-300' }}
          />
          <pre>{actor.stats.body}</pre>
        </ItemContent>
      </Button>
    </div>
  )
}

export { Actor }
