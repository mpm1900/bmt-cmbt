import type { SAction, State } from '@/game/state'
import type { DeltaContext } from '@/game/types/delta'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Button } from '../ui/button'
import { useGameState } from '@/hooks/useGameState'
import { useEffect, useState, type ComponentProps } from 'react'
import { ArrowRight } from 'lucide-react'
import { ActionUniqueTargetButton } from './action-unique-target-button'
import { ActionRepeatTargetButton } from './action-repeat-target-button'
import { ActionRepeatPages } from './action-repeat-pages'
import { newContext } from '@/game/mutations'
import { usePlayerID } from '@/hooks/usePlayer'
import { cn } from '@/lib/utils'

function getSelectedCount(context: DeltaContext) {
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
  context: DeltaContext
  onContextChange: (context: DeltaContext) => void
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
        <div className="flex flex-col w-full justify-around gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap gap-2 w-full justify-center">
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
  context: DeltaContext
  onContextChange: (context: DeltaContext) => void
}) {
  const playerID = usePlayerID()
  const targets = action.targets.get(state, context)
  const players = new Set(targets.map((t) => t.target.playerID))
  if (players.size > 1 && targets.length > 4) {
    return (
      <div className="flex flex-col w-full justify-around pt-4 gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap gap-2 w-full justify-center">
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
  ...props
}: ComponentProps<typeof Card> & {
  playerID: string
  action: SAction
  sourceID: string | undefined
  context: DeltaContext
  onContextChange: (context: DeltaContext) => void
  onContextConfirm: (context: DeltaContext) => void
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

  const max = action.targets.max(state, context)
  const maxP = !action.targets.unique
    ? max
    : Math.min(max, action.targets.get(state, context).length)
  const ready = action.targets.validate(state, context)
  const selectedTargets = getSelectedCount(context)
  const done = max === selectedTargets

  return (
    <Card
      {...props}
      className="bg-transparent border-none ring-0 shadow-none gap-6"
    >
      <CardHeader className="gap-0 text-center text-shadow-lg rounded-xs bg-background border ring ring-black py-2 self-center min-w-60">
        <CardTitle className="text-xl">Select {action.name} Targets</CardTitle>
        <CardDescription className="text-xs">
          {max > 0 ? (
            <span>
              {selectedTargets} of {maxP} Targets selected.
            </span>
          ) : (
            <span>No selection required.</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8">
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
        <Button
          disabled={!ready}
          className={cn({ '!opacity-0': !ready })}
          variant={done ? 'default' : 'secondary'}
          onClick={() => onContextConfirm(context)}
        >
          Confirm {maxP > 1 && ready && `(${selectedTargets}/${maxP})`}
          <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  )
}

export { getSelectedCount, ActionContextBuilder }
