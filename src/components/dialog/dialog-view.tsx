import { useGameState } from '@/hooks/useGameState'
import { Card, CardContent } from '../ui/card'
import { newContext } from '@/game/mutations'
import { DialogOptionNoTarget } from './dialog-option-no-target'
import { DialogOptionSingleTarget } from './dialog-option-single-target'
import { useGameUI } from '@/hooks/useGameUI'
import { ScrollArea } from '../ui/scroll-area'
import { ButtonGroup } from '../ui/button-group'
import { useEffect } from 'react'

function DialogView() {
  const { state } = useGameState((s) => s)
  const playerID = useGameUI((s) => s.playerID)
  const messageLog = state.messageLog
  const dialog = state.dialog
  const activeNode = dialog.nodes.find((n) => n.ID === dialog.activeNodeID)
  const context = newContext({ playerID })
  useEffect(() => {
    // console.log(state)
  }, [state])
  return (
    <div className="flex-1 flex items-center justify-center px-16">
      <div className="flex flex-1 gap-4 items-center justify-center ">
        <Card className="h-140 w-172">
          <CardContent className="flex flex-1 flex-col gap-2 justify-between">
            <ScrollArea className="max-h-50 text-xs text-muted-foreground">
              {messageLog.map((message) => (
                <p key={message.ID}>{message.text}</p>
              ))}
            </ScrollArea>
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
                  {activeNode
                    .options(state, context)
                    .map((option, i) =>
                      option.type === 'no-target' ? (
                        <DialogOptionNoTarget
                          key={option.ID}
                          index={i}
                          option={option}
                          disabled={!option.action.validate(state, context)}
                        />
                      ) : (
                        <DialogOptionSingleTarget
                          key={option.ID}
                          index={i}
                          option={option}
                          disabled={!option.action.validate(state, context)}
                        />
                      )
                    )}
                </ButtonGroup>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { DialogView }
