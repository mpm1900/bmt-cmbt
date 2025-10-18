import type { SAction, SActor } from '@/game/state'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import type { ReactNode } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { RadioGroup } from '../ui/radio-group'
import { ActionRadioItem } from './action-radio-item'
import { ActionContextGenerator } from './action-context-generator'
import type { DeltaContext } from '@/game/types/delta'

function ActionSelectionCard({
  source,
  actions,
  activeActionID,
  onActiveActionIDChange,
  onActionConfirm,
  title,
  breadcrumbs,
}: {
  source: SActor | undefined
  actions: Array<SAction>
  activeActionID: string | undefined
  onActiveActionIDChange: (actionID: string | undefined) => void
  onActionConfirm: (action: SAction, context: DeltaContext) => void
  title: ReactNode
  breadcrumbs: ReactNode
}) {
  const activeAction = actions.find((action) => action.ID === activeActionID)
  return (
    <Card className="min-w-200 w-full max-w-[70%]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {breadcrumbs}
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <ScrollArea className="h-72 pr-4">
          <RadioGroup
            value={activeAction?.ID ?? null}
            onValueChange={onActiveActionIDChange}
          >
            {actions.map((action) => (
              <ActionRadioItem
                key={action.ID}
                action={action}
                active={action.ID === activeActionID}
              />
            ))}
          </RadioGroup>
        </ScrollArea>
        {activeAction && (
          <ScrollArea className="h-72">
            <ActionContextGenerator
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
