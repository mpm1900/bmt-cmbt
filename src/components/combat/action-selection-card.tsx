import type { SAction, SActor } from '@/game/state'
import { useState, type ReactNode } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { ActionItem } from './action-item'
import { ActionContextBuilder } from './action-context-builder'
import type { DeltaContext } from '@/game/types/delta'
import { newContext } from '@/game/mutations'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

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
    <motion.div
      className="w-192 flex flex-col gap-4"
      initial={{ scale: 1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      {children}
      <div className={cn('flex flex-col gap-2 items-center')}>
        <ScrollArea className="flex-1 max-h-100 hidden">
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
      </div>
    </motion.div>
  )
}

export { ActionSelectionCard }
