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
          <CardContent className="flex flex-col gap-2">
            {messageLog.map((message) => (
              <p key={message.ID}>{message.text}</p>
            ))}
            <Separator />
            {activeNode && (
              <div className="flex flex-col gap-2">
                {activeNode.messages(state, context).map((message) => (
                  <p key={message.ID}>{message.text}</p>
                ))}
                <Separator />
                {activeNode.options(state, context).map((option, i) => (
                  <Button
                    key={option.ID}
                    variant="secondary"
                    className="w-full justify-start"
                    disabled={state.mutationQueue.length > 0}
                    onClick={() => resolveDialogOption(option)}
                  >
                    {i + 1}) {option.text}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { DialogView }
