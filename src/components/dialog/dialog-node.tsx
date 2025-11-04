import { useGameState } from '@/hooks/useGameState'
import { CardContent } from '../ui/card'
import { DialogHistoryLog } from './dialog-history-log'
import { DialogOption, DialogOptionGroup } from './dialog-option'
import { withContext } from '@/game/dialog'
import { usePlayerID } from '@/hooks/usePlayer'
import { newContext } from '@/game/mutations'
import { DialogActiveMessages } from './dialog-active-messages'
import { ItemsTable } from './items-table'
import { Button } from '../ui/button'
import { GiCreditsCurrency } from 'react-icons/gi'
import { hasNext } from '@/game/next'
import { getActiveNode } from '@/game/access'
import { PurchaseItem } from '@/game/data/actions/_system/purchase-item'

function DialogNode() {
  const { state, resolveActionItem } = useGameState((s) => s)
  const playerID = usePlayerID()
  const context = newContext({ playerID })
  const activeNode = getActiveNode(state)
  const loading = hasNext(state)
  if (!activeNode) return null

  return (
    <CardContent className="flex flex-1 flex-col gap-2 justify-between">
      <DialogHistoryLog />
      <div className="flex flex-1 flex-col justify-between">
        <DialogActiveMessages messages={activeNode.messages(state, context)} />
        {activeNode.type === 'shop' && (
          <ItemsTable
            items={activeNode.items}
            actionHeader="Buy"
            actions={(item) => {
              const action = PurchaseItem(item.ID)
              return (
                <Button
                  size="xs"
                  variant="secondary"
                  className="cursor-pointer"
                  disabled={loading || !action.validate(state, context)}
                  onClick={() => resolveActionItem(action, context)}
                >
                  {item.value}
                  <GiCreditsCurrency className="opacity-40" />
                </Button>
              )
            }}
          />
        )}
        <DialogOptionGroup>
          {activeNode.options(state, context).map((option, index) => (
            <DialogOption
              key={option.ID}
              index={index + 1}
              option={option}
              onConfirm={(context) => {
                const o = withContext(option, context)
                resolveActionItem(o.action, o.context)
              }}
            />
          ))}
        </DialogOptionGroup>
      </div>
    </CardContent>
  )
}

export { DialogNode }
