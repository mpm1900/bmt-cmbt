import type { SAction, State } from '@/game/state'
import type { DeltaPositionContext } from '@/game/types/delta'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { ButtonGroup } from '../ui/button-group'
import { Button } from '../ui/button'
import { useGameState } from '@/hooks/useGameState'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useGameUI } from '@/hooks/useGameUI'
import { ACTION_RENDERERS } from '@/renderers'
import { ActionUniqueTargetButton } from './action-unique-target-button'
import { ActionRepeatTargetButton } from './action-repeat-target-button'
import { ActionRepeatPages } from './action-repeat-pages'
import { cn } from '@/lib/utils'

function getSelectedCount(context: DeltaPositionContext) {
  return (
    context.positions.filter((p) => !!p).length +
    context.targetIDs.filter((id) => !!id).length
  )
}

function DuplicateTargetGenerator({
  action,
  context,
  onContextChange,
  state,
}: {
  action: SAction
  context: DeltaPositionContext
  onContextChange: (context: DeltaPositionContext) => void
  state: State
}) {
  const [targetIndex, setTargetIndex] = useState(0)
  const max = action.targets.max(state, context)
  const targets = action.targets.get(state, context)
  const players = new Set(targets.map((t) => t.target.playerID))

  function next() {
    setTargetIndex((i) => (i + 1) % max)
  }

  useEffect(() => {
    setTargetIndex(0)
  }, [context.sourceID, action.ID])

  return (
    <>
      {players.size > 1 ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="font-semibold text-sm">Ally Targets</div>
            <ButtonGroup className={cn('border rounded-md flex-wrap')}>
              {targets
                .filter((t) => t.target.playerID === context.playerID)
                .map(({ target, type }) => {
                  return (
                    <ActionRepeatTargetButton
                      key={target.ID}
                      state={state}
                      action={action}
                      target={target}
                      type={type}
                      index={targetIndex}
                      context={context}
                      onContextChange={onContextChange}
                      next={next}
                    />
                  )
                })}
            </ButtonGroup>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <div className="font-semibold text-sm">Enemy Targets</div>
            <ButtonGroup className={cn('border rounded-md flex-wrap')}>
              {targets
                .filter((t) => t.target.playerID !== context.playerID)
                .map(({ target, type }) => {
                  return (
                    <ActionRepeatTargetButton
                      key={target.ID}
                      state={state}
                      action={action}
                      target={target}
                      type={type}
                      index={targetIndex}
                      context={context}
                      onContextChange={onContextChange}
                      next={next}
                    />
                  )
                })}
            </ButtonGroup>
          </div>
        </div>
      ) : (
        <ButtonGroup className="border rounded-md">
          {action.targets.get(state, context).map(({ target, type }) => {
            return (
              <ActionRepeatTargetButton
                key={target.ID}
                state={state}
                action={action}
                target={target}
                type={type}
                index={targetIndex}
                context={context}
                onContextChange={onContextChange}
                next={next}
              />
            )
          })}
        </ButtonGroup>
      )}
      <ActionRepeatPages
        state={state}
        action={action}
        context={context}
        index={targetIndex}
        onIndexChange={setTargetIndex}
      />
    </>
  )
}

function UniqueTargetGenerator({
  action,
  state,
  context,
  onContextChange,
}: {
  action: SAction
  state: State
  context: DeltaPositionContext
  onContextChange: (context: DeltaPositionContext) => void
}) {
  const targets = action.targets.get(state, context)
  const players = new Set(targets.map((t) => t.target.playerID))
  if (players.size > 1) {
    return (
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <div className="font-semibold text-sm">Ally Targets</div>
          <ButtonGroup className={cn('border rounded-md flex-wrap')}>
            {targets
              .filter((t) => t.target.playerID === context.playerID)
              .map(({ target, type }) => {
                return (
                  <ActionUniqueTargetButton
                    key={target.ID}
                    state={state}
                    action={action}
                    target={target}
                    type={type}
                    context={context}
                    onContextChange={onContextChange}
                  />
                )
              })}
          </ButtonGroup>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <div className="font-semibold text-sm">Enemy Targets</div>
          <ButtonGroup className={cn('border rounded-md flex-wrap')}>
            {targets
              .filter((t) => t.target.playerID !== context.playerID)
              .map(({ target, type }) => {
                return (
                  <ActionUniqueTargetButton
                    key={target.ID}
                    state={state}
                    action={action}
                    target={target}
                    type={type}
                    context={context}
                    onContextChange={onContextChange}
                  />
                )
              })}
          </ButtonGroup>
        </div>
      </div>
    )
  }
  return (
    <ButtonGroup className={cn('border rounded-md flex-wrap')}>
      {targets.map(({ target, type }) => {
        return (
          <ActionUniqueTargetButton
            key={target.ID}
            state={state}
            action={action}
            target={target}
            type={type}
            context={context}
            onContextChange={onContextChange}
          />
        )
      })}
    </ButtonGroup>
  )
}

function ActionContextGenerator({
  playerID,
  action,
  sourceID,
  onContextConfirm,
}: {
  playerID: string
  action: SAction
  sourceID: string | undefined
  onContextConfirm: (context: DeltaPositionContext) => void
}) {
  const state = useGameState((s) => s.state)
  const { stagingContext, set: setUI } = useGameUI((s) => s)

  useEffect(() => {
    setUI({
      stagingContext: {
        playerID,
        sourceID: sourceID ?? '',
        positions: [],
        targetIDs: [],
      },
    })
  }, [sourceID, action.ID])

  if (!stagingContext) return null

  const renderer = ACTION_RENDERERS[action.ID]
  const max = action.targets.max(state, stagingContext)
  const maxP = !action.targets.unique
    ? max
    : Math.min(max, action.targets.get(state, stagingContext).length)
  const ready = action.validate(state, stagingContext)
  const selectedTargets = getSelectedCount(stagingContext)
  const done = max === selectedTargets

  return (
    <Card>
      <CardHeader>
        <CardTitle>{action.name}</CardTitle>
        {renderer && (
          <CardDescription>
            <renderer.DescriptionShort />
          </CardDescription>
        )}
        {renderer && (
          <CardAction>
            <renderer.Icons />
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4">
          {!action.targets.unique && (
            <DuplicateTargetGenerator
              action={action}
              state={state}
              context={stagingContext}
              onContextChange={(c) => setUI({ stagingContext: c })}
            />
          )}
          {action.targets.unique && (
            <UniqueTargetGenerator
              action={action}
              state={state}
              context={stagingContext}
              onContextChange={(c) => setUI({ stagingContext: c })}
            />
          )}
        </div>
      </CardContent>

      <CardFooter className="justify-end items-center gap-4">
        {
          <div className="text-muted-foreground text-sm text-end">
            {maxP > 0 ? (
              <span>
                {selectedTargets}/{maxP} Targets selected.
              </span>
            ) : (
              <span>No selection required.</span>
            )}
          </div>
        }
        {ready && (
          <Button
            variant={done ? 'default' : 'secondary'}
            onClick={() => onContextConfirm(stagingContext)}
          >
            Confirm
            <ArrowRight />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export { getSelectedCount, ActionContextGenerator }
