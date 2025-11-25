import type { SAction, SActor, State } from '@/game/state'
import type { ActionTarget } from '@/game/types/action'
import type { DeltaContext } from '@/game/types/delta'
import { getSelectedCount } from './action-context-builder'
import { getPosition, positionEquals } from '@/game/player'
import { Button } from '../ui/button'
import { Target } from 'lucide-react'
import { useGameUI } from '@/hooks/useGameUI'

function ActionRepeatTargetButton({
  state,
  action,
  target,
  type,
  index,
  allied,
  context,
  onContextChange,
  next,
}: {
  state: State
  action: SAction
  target: SActor
  type: ActionTarget<SActor>['type']
  index: number
  allied: boolean
  context: DeltaContext
  onContextChange: (context: DeltaContext) => void
  next: () => void
}) {
  const max = action.targets.max(state, context)
  const done = getSelectedCount(context) === max

  if (type === 'targetID') {
    return (
      <ActionTargetIdButton
        allied={allied}
        target={target}
        disabled={true}
        index={index}
        context={context}
        onContextChange={(c) => {
          onContextChange({ ...context, ...c })
          if (!done) next()
        }}
      />
    )
  }
  if (type === 'position') {
    return (
      <ActionPositionButton
        state={state}
        allied={allied}
        target={target}
        disabled={true}
        index={index}
        context={context}
        onContextChange={(c) => {
          onContextChange({ ...context, ...c })
          if (!done) next()
        }}
      />
    )
  }
}

function ActionTargetIdButton({
  target,
  index,
  disabled,
  allied,
  context,
  onContextChange,
}: {
  target: SActor
  disabled: boolean
  index: number
  allied: boolean
  context: DeltaContext
  onContextChange: (context: Partial<DeltaContext>) => void
}) {
  const set = useGameUI((s) => s.set)
  const contextTargetID = context.targetIDs[index]
  const active = contextTargetID === target.ID
  return (
    <Button
      size="sm"
      variant={
        active
          ? allied
            ? 'slate-active'
            : 'stone-active'
          : allied
            ? 'slate'
            : 'stone'
      }
      disabled={disabled && active}
      onClick={() => {
        if (active) return
        const targetIDs = [...context.targetIDs]
        targetIDs[index] = target.ID
        onContextChange({
          targetIDs,
        })
      }}
      onMouseEnter={() => {
        set({ hoverActorID: target.ID })
      }}
      onMouseLeave={() => {
        set({ hoverActorID: undefined })
      }}
    >
      {active && <Target />}
      {target.name}
    </Button>
  )
}

function ActionPositionButton({
  state,
  target,
  disabled,
  allied,
  index,
  context,
  onContextChange,
}: {
  state: State
  target: SActor
  disabled: boolean
  allied: boolean
  index: number
  context: DeltaContext
  onContextChange: (context: Partial<DeltaContext>) => void
}) {
  const set = useGameUI((s) => s.set)
  const targetPosition = getPosition(state, target.ID)
  const contextPosition = context.positions[index]
  const active = positionEquals(targetPosition, contextPosition)

  return (
    <Button
      size="sm"
      variant={
        active
          ? allied
            ? 'slate-active'
            : 'stone-active'
          : allied
            ? 'slate'
            : 'stone'
      }
      disabled={disabled && active}
      onClick={() => {
        if (!targetPosition) return
        if (active) return
        const positions = [...context.positions]
        positions[index] = targetPosition
        onContextChange({
          positions,
        })
      }}
      onMouseEnter={() => {
        set({ hoverActorID: target.ID })
      }}
      onMouseLeave={() => {
        set({ hoverActorID: undefined })
      }}
    >
      {active && <Target />}
      {target.name}
    </Button>
  )
}

export { ActionRepeatTargetButton }
