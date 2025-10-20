import type { SAction, SActor } from '@/game/state'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import type { ReactNode } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { ActionRadioItem } from './action-radio-item'
import { ActionContextGenerator } from './action-context-generator'
import type { DeltaPositionContext } from '@/game/types/delta'

function ActionSelectionCard({
  playerID,
  source,
  actions,
  activeActionID,
  onActiveActionIDChange,
  onActionConfirm,
  title,
  breadcrumbs,
}: {
  playerID: string
  source: SActor | undefined
  actions: Array<SAction>
  activeActionID: string | undefined
  onActiveActionIDChange: (actionID: string | undefined) => void
  onActionConfirm: (action: SAction, context: DeltaPositionContext) => void
  title?: ReactNode
  breadcrumbs: ReactNode
}) {
  const activeAction = actions.find((action) => action.ID === activeActionID)
  return (
    <Card className="w-172">
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="grid grid-cols-2 gap-3">
        <ScrollArea className="h-72 pr-3">
          <div className="flex flex-col gap-2">
            {actions.map((action) => (
              <ActionRadioItem
                key={action.ID}
                action={action}
                active={action.ID === activeActionID}
                onActiveChange={() => {
                  onActiveActionIDChange(action.ID)
                }}
              />
            ))}
          </div>
        </ScrollArea>
        {activeAction && (
          <ScrollArea className="h-72">
            <ActionContextGenerator
              playerID={playerID}
              action={activeAction}
              sourceID={source?.ID}
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
