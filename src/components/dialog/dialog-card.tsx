import { useGameState } from '@/hooks/useGameState'
import { Card, CardContent } from '../ui/card'
import { DialogOptionNoTarget } from './dialog-option-no-target'
import { DialogOptionSingleTarget } from './dialog-option-single-target'
import { ButtonGroup } from '../ui/button-group'
import { DialogHistoryLog } from './dialog-history-log'
import { newContext } from '@/game/mutations'

function DialogCard() {
  const { state } = useGameState((s) => s)
  const dialog = state.dialog
  const activeNode = dialog.nodes.find((n) => n.ID === dialog.activeNodeID)

  return (
    <Card className="h-140 w-172">
      <CardContent className="flex flex-1 flex-col gap-2 justify-between">
        <DialogHistoryLog />
        {activeNode && (
          <div className="flex flex-1 flex-col justify-between">
            <div>
              {activeNode.messages(state).map((message) => (
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
                .options(state)
                .map((option, i) =>
                  option.type === 'no-target' ? (
                    <DialogOptionNoTarget
                      key={option.ID}
                      index={i}
                      option={option}
                      disabled={!option.action.validate(state, newContext({}))}
                    />
                  ) : (
                    <DialogOptionSingleTarget
                      key={option.ID}
                      index={i}
                      option={option}
                    />
                  )
                )}
            </ButtonGroup>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { DialogCard }
