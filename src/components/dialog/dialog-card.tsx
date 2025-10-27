import { useGameState } from '@/hooks/useGameState'
import { Card, CardContent } from '../ui/card'
import { ButtonGroup } from '../ui/button-group'
import { DialogHistoryLog } from './dialog-history-log'
import { DialogOption } from './dialog-option'
import { withContext } from '@/game/dialog'
import { usePlayerID } from '@/hooks/usePlayer'
import { newContext } from '@/game/mutations'

function DialogCard() {
  const { state, resolveDialogOption } = useGameState((s) => s)
  const playerID = usePlayerID()
  const context = newContext({ playerID })
  const dialog = state.dialog
  const activeNode = dialog.nodes.find((n) => n.ID === dialog.activeNodeID)

  return (
    <Card className="h-152 w-172">
      <CardContent className="flex flex-1 flex-col gap-2 justify-between">
        <DialogHistoryLog />
        {activeNode && (
          <div className="flex flex-1 flex-col justify-between">
            <div>
              {activeNode.messages(state, context).map((message) => (
                <p key={message.ID} className="text-sm">
                  {message.text}
                </p>
              ))}
            </div>

            <ButtonGroup
              orientation="vertical"
              className="flex flex-col gap-0 w-full"
            >
              {activeNode.options(state, context).map((option) => (
                <DialogOption
                  key={option.ID}
                  option={option}
                  onConfirm={(context) => {
                    resolveDialogOption(withContext(option, context))
                  }}
                />
              ))}
            </ButtonGroup>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { DialogCard }
