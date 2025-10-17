import type { SAction, State } from '@/game/state'
import type { DeltaContext } from '@/game/types/delta'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { ButtonGroup } from './ui/button-group'
import { Button } from './ui/button'
import { useGameState } from '@/hooks/useGameState'
import { useEffect, useState } from 'react'
import { ArrowRight, CircleDashed, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGameUI } from '@/hooks/useGameUI'

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
  const [targetIndex, setTargetIndex] = useState(0)
  const max = action.maxTargetCount(state, context)
  const done = context.targetIDs.length === max

  useEffect(() => {
    setTargetIndex(0)
  }, [context.sourceID, action.ID])

  return (
    <>
      <ButtonGroup className={cn({ 'border rounded-lg border-ring': done })}>
        {Array.from({
          length: action.maxTargetCount(state, context),
        }).map((_, i) => (
          <Button
            key={i}
            variant={i === targetIndex ? 'default' : 'secondary'}
            size="icon-sm"
            onClick={() => setTargetIndex(i)}
          >
            {context.targetIDs[i] ? <Target /> : <CircleDashed />}
          </Button>
        ))}
      </ButtonGroup>
      <ButtonGroup>
        {action.targets(state, context).map((target) => (
          <Button
            key={target.ID}
            variant={
              target.ID === context.targetIDs[targetIndex]
                ? 'default'
                : 'secondary'
            }
            onClick={() => {
              const tids = [...context.targetIDs]
              tids[targetIndex] = target.ID
              onContextChange({
                ...context,
                targetIDs: tids,
              })

              setTargetIndex((v) => (v + 1) % max)
            }}
          >
            {target.name}
          </Button>
        ))}
      </ButtonGroup>
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
  const max = action.maxTargetCount(state, context)
  const done = context.targetIDs.length === max
  const ready = action.validate(state, context)

  return (
    <ButtonGroup>
      {action.targets(state, context).map((target) => (
        <Button
          key={target.ID}
          disabled={ready && done && !context.targetIDs.includes(target.ID)}
          variant={
            context.targetIDs.includes(target.ID) ? 'default' : 'secondary'
          }
          onClick={() => {
            if (context.targetIDs.includes(target.ID)) {
              onContextChange({
                ...context,
                targetIDs: context.targetIDs.filter((id) => id !== target.ID),
              })
            } else {
              onContextChange({
                ...context,
                targetIDs: [...context.targetIDs, target.ID],
              })
            }
          }}
        >
          {target.name}
        </Button>
      ))}
    </ButtonGroup>
  )
}

function ActionContextGenerator({
  action,
  sourceID,
  onContextConfirm,
}: {
  action: SAction
  sourceID: string
  onContextConfirm: (context: DeltaContext) => void
}) {
  const state = useGameState((s) => s.state)
  const { stagingContext = { sourceID, targetIDs: [] }, set: setUI } =
    useGameUI((s) => s)
  const max = action.maxTargetCount(state, stagingContext)

  useEffect(() => {
    setUI({
      stagingContext: {
        sourceID,
        targetIDs: [],
      },
    })
  }, [sourceID, action.ID])

  const ready = action.validate(state, stagingContext)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{action.name}</CardTitle>
        <CardDescription>Select {max} Target(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4">
          {!action.uniqueTargets && (
            <DuplicateTargetGenerator
              action={action}
              state={state}
              context={stagingContext}
              onContextChange={(c) => setUI({ stagingContext: c })}
            />
          )}
          {action.uniqueTargets && (
            <UniqueTargetGenerator
              action={action}
              state={state}
              context={stagingContext}
              onContextChange={(c) => setUI({ stagingContext: c })}
            />
          )}
        </div>
      </CardContent>
      {ready && (
        <CardFooter className="justify-end">
          <Button
            variant="outline"
            onClick={() => onContextConfirm(stagingContext)}
          >
            Confirm
            <ArrowRight />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export { ActionContextGenerator }
