import { useGameState } from '@/hooks/useGameState'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { newContext } from '@/game/mutations'

function DialogView() {
  const { resolveDialogOption, state } = useGameState((s) => s)
  const messageLog = state.messageLog
  const dialog = state.dialog
  const activeNode = dialog.nodes.find((n) => n.ID === dialog.activeNodeID)
  const context = newContext({})
  return (
    <div className="flex-1 flex items-center justify-center px-16">
      <div className="flex flex-1 gap-4 items-center justify-center max-w-252">
        <Card>
          <CardContent>
            {messageLog.map((message) => (
              <p key={message.ID}>{message.text}</p>
            ))}
            <Separator />
            {activeNode && (
              <div>
                {activeNode.messages(state, context).map((message) => (
                  <p key={message.ID}>{message.text}</p>
                ))}
                <Separator />
                {activeNode.options(state, context).map((option) => (
                  <Button
                    key={option.ID}
                    disabled={state.mutationQueue.length > 0}
                    onClick={() => resolveDialogOption(option)}
                  >
                    {option.text}
                  </Button>
                ))}
                <Separator />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { DialogView }
