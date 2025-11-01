import type { SAction, SActor, State } from '@/game/state'
import type { ActionTarget } from '@/game/types/action'
import { Button } from '../ui/button'
import type { DeltaPositionContext } from '@/game/types/delta'
import { getPosition, positionEquals } from '@/game/player'
import { getSelectedCount } from './action-context-builder'

function ActionUniqueTargetButton({
  state,
  action,
  target,
  type,
  allied,
  context,
  onContextChange,
}: {
  state: State
  action: SAction
  target: SActor
  type: ActionTarget<SActor>['type']
  allied: boolean
  context: DeltaPositionContext
  onContextChange: (context: DeltaPositionContext) => void
}) {
  const max = action.targets.max(state, context)
  const ready = action.targets.validate(state, context)
  const done = getSelectedCount(context) === max

  return (
    <>
      {type === 'targetID' && (
        <ActionTargetIdButton
          target={target}
          disabled={done && ready}
          context={context}
          allied={allied}
          onContextChange={(c) => onContextChange({ ...context, ...c })}
        />
      )}
      {type === 'position' && (
        <ActionPositionButton
          state={state}
          target={target}
          disabled={done && ready}
          allied={allied}
          context={context}
          onContextChange={(c) =>
            onContextChange({
              ...context,
              ...c,
            })
          }
        />
      )}
    </>
  )
}

function ActionTargetIdButton({
  target,
  context,
  disabled,
  allied,
  onContextChange,
}: {
  target: SActor
  disabled: boolean
  allied: boolean
  context: DeltaPositionContext
  onContextChange: (context: Partial<DeltaPositionContext>) => void
}) {
  const active = context.targetIDs.includes(target.ID)
  return (
    <Button
      size="sm"
      variant={
        active
          ? allied
            ? 'default-slate'
            : 'default-stone'
          : allied
            ? 'slate'
            : 'stone'
      }
      disabled={disabled && !active}
      onClick={() => {
        if (active) {
          onContextChange({
            targetIDs: context.targetIDs.filter((id) => id !== target.ID),
          })
        } else {
          onContextChange({
            targetIDs: [...context.targetIDs, target.ID],
          })
        }
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
  allied,
  context,
  onContextChange,
}: {
  state: State
  target: SActor
  disabled: boolean
  allied: boolean
  context: DeltaPositionContext
  onContextChange: (context: Partial<DeltaPositionContext>) => void
}) {
  const position = getPosition(state, target.ID)
  const active =
    position !== undefined &&
    context.positions.some((p) => positionEquals(p, position))
  return (
    <Button
      size="sm"
      variant={
        active
          ? allied
            ? 'default-slate'
            : 'default-stone'
          : allied
            ? 'slate'
            : 'stone'
      }
      disabled={disabled && !active}
      onClick={() => {
        if (!position) return
        if (active) {
          onContextChange({
            positions: context.positions.filter(
              (p) => !positionEquals(p, position)
            ),
          })
        }
        if (!active) {
          onContextChange({
            positions: [...context.positions, position],
          })
        }
      }}
    >
      {target.name}
    </Button>
  )
}

export { ActionUniqueTargetButton }
