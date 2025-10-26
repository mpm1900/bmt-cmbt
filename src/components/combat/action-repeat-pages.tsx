import { cn } from '@/lib/utils'
import { ButtonGroup } from '../ui/button-group'
import { Button } from '../ui/button'
import { Circle, Target } from 'lucide-react'
import type { DeltaPositionContext } from '@/game/types/delta'
import type { SAction, State } from '@/game/state'
import { getSelectedCount } from './action-context-builder'

function ActionRepeatPages({
  state,
  action,
  context,
  index,
  onIndexChange,
}: {
  state: State
  action: SAction
  context: DeltaPositionContext
  index: number
  onIndexChange: (index: number) => void
}) {
  const max = action.targets.max(state, context)
  const done = getSelectedCount(context) === max
  const pages = Array.from({ length: max })

  return (
    <ButtonGroup className={cn({ 'border rounded-lg border-ring': done })}>
      {pages.map((_, i) => (
        <Button
          key={i}
          variant={i === index ? 'default' : 'secondary'}
          size="icon-sm"
          onClick={() => onIndexChange(i)}
        >
          {context.positions[i] ? (
            <Target />
          ) : (
            <Circle className="opacity-20" />
          )}
        </Button>
      ))}
    </ButtonGroup>
  )
}

export { ActionRepeatPages }
