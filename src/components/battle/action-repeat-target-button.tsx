import type { SAction, SActor, State } from '@/game/state'
import type { ActionTarget } from '@/game/types/action'
import type { DeltaPositionContext } from '@/game/types/delta'
import { getSelectedCount } from './action-context-generator'
import { getPosition, positionEquals } from '@/game/player'
import { Button } from '../ui/button'

function ActionRepeatTargetButton({
  state,
  action,
  target,
  type,
  index,
  context,
  onContextChange,
  next,
}: {
  state: State
  action: SAction
  target: SActor
  type: ActionTarget<SActor>['type']
  index: number
  context: DeltaPositionContext
  onContextChange: (context: DeltaPositionContext) => void
  next: () => void
}) {
  const max = action.targets.max(state, context)
  const done = getSelectedCount(context) === max
  const ready = action.validate(state, context)

  if (type === 'targetID') {
    return (
      <ActionTargetIdButton
        target={target}
        disabled={done && ready}
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
        target={target}
        disabled={done && ready}
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
  context,
  onContextChange,
}: {
  target: SActor
  disabled: boolean
  index: number
  context: DeltaPositionContext
  onContextChange: (context: Partial<DeltaPositionContext>) => void
}) {
  const contextTargetID = context.targetIDs[index]
  const active = contextTargetID === target.ID
  return (
    <Button
      variant={active ? 'default' : 'secondary'}
      disabled={disabled && active}
      onClick={() => {
        if (active) return
        const targetIDs = [...context.targetIDs]
        targetIDs[index] = target.ID
        onContextChange({
          targetIDs,
        })
      }}
    >
      {target.name}
    </Button>
  )
}

function ActionPositionButton({
  state,
  target,
  disabled,
  index,
  context,
  onContextChange,
}: {
  state: State
  target: SActor
  disabled: boolean
  index: number
  context: DeltaPositionContext
  onContextChange: (context: Partial<DeltaPositionContext>) => void
}) {
  const targetPosition = getPosition(state, target.ID)
  const contextPosition = context.positions[index]
  const active = positionEquals(targetPosition, contextPosition)

  return (
    <Button
      variant={active ? 'default' : 'secondary'}
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
    >
      {target.name}
    </Button>
  )
}

export { ActionRepeatTargetButton }
