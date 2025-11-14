import type { SAction, SActor } from '@/game/state'
import { Card, CardContent, CardHeader } from '../ui/card'
import { useState, type ReactNode } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { ActionItem } from './action-item'
import { ActionContextBuilder } from './action-context-builder'
import type { DeltaContext } from '@/game/types/delta'
import { newContext } from '@/game/mutations'
import { CombatViewTabs } from './combat-view-tabs'

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
  onActionConfirm: (action: SAction, context: DeltaContext) => void
  children?: ReactNode
}) {
  const [context, setContext] = useState<DeltaContext>(
    newContext<{}>({ playerID })
  )
  const activeAction = actions.find((action) => action.ID === activeActionID)
  return (
    <Card
      className="w-192 gap-2"
      initial={{ scale: 1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      {children || (
        <CardHeader>
          <CombatViewTabs />
        </CardHeader>
      )}
      <CardContent className="flex gap-5">
        <ScrollArea className="max-h-98.5 pr-3 flex-1 min-w-1/2">
          <div className="flex flex-col gap-1 px-px">
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
          <div className="flex-1">
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
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { ActionSelectionCard }
