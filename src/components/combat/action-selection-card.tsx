import type { SAction, SActor } from '@/game/state'
import { Card, CardContent } from '../ui/card'
import { useState, type ReactNode } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { ActionItem } from './action-item'
import { ActionContextBuilder } from './action-context-builder'
import type { DeltaPositionContext } from '@/game/types/delta'
import { newContext } from '@/game/mutations'

function ActionSelectionCard({
  playerID,
  source,
  actions,
  activeActionID,
  onActiveActionIDChange,
  onActionConfirm,
  children,
}: {
  playerID: string
  source: SActor | undefined
  actions: Array<SAction>
  activeActionID: string | undefined
  onActiveActionIDChange: (actionID: string | undefined) => void
  onActionConfirm: (action: SAction, context: DeltaPositionContext) => void
  children?: ReactNode
}) {
  const [context, setContext] = useState<DeltaPositionContext>(
    newContext<{}>({ playerID })
  )
  const activeAction = actions.find((action) => action.ID === activeActionID)
  return (
    <Card className="w-180 gap-4">
      {children}
      <CardContent className="grid grid-cols-2 gap-3">
        <ScrollArea className="max-h-90 pr-3">
          <div className="flex flex-col gap-2">
            {actions.map((action) => (
              <ActionItem
                key={action.ID}
                action={action}
                context={context}
                active={action.ID === activeActionID}
                onActiveChange={() => {
                  onActiveActionIDChange(action.ID)
                }}
              />
            ))}
          </div>
        </ScrollArea>
        {activeAction && (
          <ScrollArea className="max-h-90">
            <ActionContextBuilder
              playerID={playerID}
              action={activeAction}
              sourceID={source?.ID}
              context={context}
              onContextChange={setContext}
              onContextConfirm={(context) => {
                onActionConfirm(activeAction, context)
              }}
            />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

export { ActionSelectionCard }
