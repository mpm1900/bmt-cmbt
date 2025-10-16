import type { SActor, SModifier } from '@/game/state'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import { Atom, EllipsisVertical } from 'lucide-react'
import { InputGroupButton } from './ui/input-group'
import { Item, ItemContent, ItemTitle } from './ui/item'
import { Progress } from './ui/progress'

const actorButtonVariants = cva('relative h-auto p-4', {
  variants: {
    variant: {
      default: 'bg-card hover:bg-accent cursor-pointer',
      disabled: 'border-border/40 bg-card [&>*]:opacity-70',
      active: 'bg-sidebar border-ring hover:bg-accent',
      targeted: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

function ActorButton({
  className,
  active,
  disabled,
  ...props
}: React.ComponentProps<typeof Item> & {
  active?: boolean
  disabled?: boolean
}) {
  const variant = disabled ? 'disabled' : active ? 'active' : 'default'
  return (
    <Item
      className={cn(actorButtonVariants({ variant }), className)}
      {...props}
    />
  )
}

function Actor({
  actor,
  active,
  disabled,
  modifiers = [],
  onClick,
  ...rest
}: React.ComponentProps<'div'> & {
  actor: SActor
  modifiers: Array<SModifier>
  active: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <div className="group relative flex flex-col justify-end w-64" {...rest}>
      <div className="flex transition-all justify-between -mb-3 mt-4 group-hover:mb-1 group-hover:-mt-3 z-10">
        <div className="flex -space-x-3 group-hover:space-x-1 transition-all flex-wrap">
          {modifiers.map((modifier) => (
            <InputGroupButton
              key={modifier.ID}
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
      <ActorButton
        variant="outline"
        className="z-20"
        active={active}
        disabled={disabled}
        onClick={() => onClick()}
      >
        <ItemContent>
          <ItemTitle>{actor.name}</ItemTitle>
          <Progress
            value={
              ((actor.stats.body - actor.state.damage) * 100) / actor.stats.body
            }
          />
          <Progress
            value={100}
            className="h-1"
            indicator={{ className: 'bg-blue-300' }}
          />
        </ItemContent>
      </ActorButton>
    </div>
  )
}

export { Actor }
