import { useGameState } from '@/hooks/useGameState'
import { Card, CardContent } from '../ui/card'
import { Separator } from '../ui/separator'
import { newContext } from '@/game/mutations'
import { DialogOptionStatic } from './dialog-option-static'
import { DialogOptionDynamic } from './dialog-option-dynamic'
import { useGameUI } from '@/hooks/useGameUI'

function DialogView() {
  const { state } = useGameState((s) => s)
  const playerID = useGameUI((s) => s.playerID)
  const messageLog = state.messageLog
  const dialog = state.dialog
  const activeNode = dialog.nodes.find((n) => n.ID === dialog.activeNodeID)
  const context = newContext({ playerID })
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
                {activeNode
                  .options(state, context)
                  .filter((o) => o.action.validate(state, context))
                  .map((option, i) =>
                    option.type === 'static' ? (
                      <DialogOptionStatic
                        key={option.ID}
                        index={i}
                        option={option}
                      />
                    ) : (
                      <DialogOptionDynamic
                        key={option.ID}
                        index={i}
                        option={option}
                      />
                    )
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { DialogView }
