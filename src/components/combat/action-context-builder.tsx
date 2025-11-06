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
import { Button } from '../ui/button'
import { useGameState } from '@/hooks/useGameState'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { ACTION_RENDERERS } from '@/renderers'
import { ActionUniqueTargetButton } from './action-unique-target-button'
import { ActionRepeatTargetButton } from './action-repeat-target-button'
import { ActionRepeatPages } from './action-repeat-pages'
import { newContext } from '@/game/mutations'
import { usePlayerID } from '@/hooks/usePlayer'

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
  const playerID = usePlayerID()
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
      <ActionRepeatPages
        state={state}
        action={action}
        context={context}
        index={targetIndex}
        onIndexChange={setTargetIndex}
      />
      {players.size > 1 && targets.length > 4 ? (
        <div className="flex flex-col w-full justify-around px-4 gap-4">
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-xs text-enemy/70 hidden">
              Enemy Targets
            </div>
            <div className="flex flex-wrap gap-2 w-full">
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
                      allied={target.playerID === playerID}
                      index={targetIndex}
                      context={context}
                      onContextChange={onContextChange}
                      next={next}
                    />
                  )
                })}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-xs text-ally/80 hidden">
              Ally Targets
            </div>
            <div className="flex flex-wrap gap-2 w-full">
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
                      allied={target.playerID === playerID}
                      index={targetIndex}
                      context={context}
                      onContextChange={onContextChange}
                      next={next}
                    />
                  )
                })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center flex-wrap gap-2 w-full">
          {action.targets.get(state, context).map(({ target, type }) => {
            return (
              <ActionRepeatTargetButton
                key={target.ID}
                state={state}
                action={action}
                target={target}
                type={type}
                allied={target.playerID === playerID}
                index={targetIndex}
                context={context}
                onContextChange={onContextChange}
                next={next}
              />
            )
          })}
        </div>
      )}
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
  const playerID = usePlayerID()
  const targets = action.targets.get(state, context)
  const players = new Set(targets.map((t) => t.target.playerID))
  if (players.size > 1 && targets.length > 4) {
    return (
      <div className="flex flex-col w-full justify-around px-4 pt-4 gap-4">
        <div className="flex flex-col gap-1">
          <div className="font-semibold text-xs text-enemy/70 hidden">
            Enemy Targets
          </div>
          <div className="flex flex-wrap gap-2 w-full">
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
                    allied={target.playerID === playerID}
                    context={context}
                    onContextChange={onContextChange}
                  />
                )
              })}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-semibold text-xs text-ally/80 hidden">
            Ally Targets
          </div>
          <div className="flex flex-wrap gap-2 w-full">
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
                    allied={target.playerID === playerID}
                    context={context}
                    onContextChange={onContextChange}
                  />
                )
              })}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex justify-center flex-wrap gap-2 w-full">
      {targets.map(({ target, type }) => {
        return (
          <ActionUniqueTargetButton
            key={target.ID}
            state={state}
            action={action}
            target={target}
            type={type}
            allied={target.playerID === playerID}
            context={context}
            onContextChange={onContextChange}
          />
        )
      })}
    </div>
  )
}

function ActionContextBuilder({
  playerID,
  action,
  sourceID,
  context,
  onContextChange,
  onContextConfirm,
}: {
  playerID: string
  action: SAction
  sourceID: string | undefined
  context: DeltaPositionContext
  onContextChange: (context: DeltaPositionContext) => void
  onContextConfirm: (context: DeltaPositionContext) => void
}) {
  const state = useGameState((s) => s.state)

  useEffect(() => {
    onContextChange(
      newContext({
        playerID,
        sourceID: sourceID,
      })
    )
  }, [sourceID, action.ID])

  const renderer = ACTION_RENDERERS[action.ID]
  const max = action.targets.max(state, context)
  const maxP = !action.targets.unique
    ? max
    : Math.min(max, action.targets.get(state, context).length)
  const ready = action.targets.validate(state, context)
  const selectedTargets = getSelectedCount(context)
  const done = max === selectedTargets

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Select Targets</CardTitle>
        <CardDescription className="text-xs">
          {max > 0 ? (
            <span>
              {selectedTargets} of {maxP} Targets selected.
            </span>
          ) : (
            <span>No selection required.</span>
          )}
        </CardDescription>
        {renderer && (
          <CardAction>
            <renderer.Icons />
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="px-3">
        <div className="flex flex-col items-center justify-center gap-4">
          {!action.targets.unique && (
            <DuplicateTargetGenerator
              action={action}
              state={state}
              context={context}
              onContextChange={onContextChange}
            />
          )}
          {action.targets.unique && (
            <UniqueTargetGenerator
              action={action}
              state={state}
              context={context}
              onContextChange={onContextChange}
            />
          )}
        </div>
      </CardContent>

      <CardFooter className="justify-end items-center gap-4">
        {ready && (
          <Button
            variant={done ? 'default' : 'secondary'}
            onClick={() => onContextConfirm(context)}
          >
            Confirm {maxP > 1 && `(${selectedTargets}/${maxP})`}
            <ArrowRight />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export { getSelectedCount, ActionContextBuilder }
