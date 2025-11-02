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

function DialogNode() {
  const { state, resolveDialogOption } = useGameState((s) => s)
  const playerID = usePlayerID()
  const context = newContext({ playerID })
  const dialog = state.dialog
  const activeNode = dialog.nodes.find((n) => n.ID === dialog.activeNodeID)
  if (!activeNode) return null

  return (
    <CardContent className="flex flex-1 flex-col gap-2 justify-between">
      <DialogHistoryLog />
      <div className="flex flex-1 flex-col justify-between">
        <DialogActiveMessages messages={activeNode.messages(state, context)} />
        {activeNode.type === 'shop' && (
          <ItemsTable
            items={activeNode.items}
            actions={(_item) => (
              <Button size="xs" variant="secondary">
                Buy (200G)
              </Button>
            )}
          />
        )}
        <DialogOptionGroup>
          {activeNode.options(state, context).map((option, index) => (
            <DialogOption
              key={option.ID}
              index={index + 1}
              option={option}
              onConfirm={(context) => {
                resolveDialogOption(withContext(option, context))
              }}
            />
          ))}
        </DialogOptionGroup>
      </div>
    </CardContent>
  )
}

export { DialogNode }
