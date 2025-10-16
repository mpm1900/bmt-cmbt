import type { SAction } from '@/game/state'
import type { DeltaContext } from '@/game/types/delta'
import { Card, CardContent } from './ui/card'
import { ButtonGroup } from './ui/button-group'
import { Button } from './ui/button'
import { useGameState } from '@/hooks/useGameState'
import { useEffect, useState } from 'react'
import { CircleDashed, Target } from 'lucide-react'
import { Separator } from './ui/separator'

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
  const [context, setContext] = useState<DeltaContext>({
    sourceID,
    targetIDs: [],
  })
  const [targetIndex, setTargetIndex] = useState(0)
  const max = action.maxTargetCount(state, context)

  useEffect(() => {
    setTargetIndex(0)
    setContext({
      sourceID,
      targetIDs: [],
    })
  }, [sourceID, action.ID])

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4">
          <span className="text-muted-foreground text-sm italic">
            Select {max} Target(s)
          </span>
          {action.uniqueTargets === false && (
            <ButtonGroup>
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
          )}
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
                  setContext({
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
          {action.validate(state, context) && (
            <>
              <Separator />
              <Button
                variant="outline"
                onClick={() => onContextConfirm(context)}
              >
                Confirm
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { ActionContextGenerator }
