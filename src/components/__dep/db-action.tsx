import type { SAction } from '@/game/state'
import { useGameState } from '@/hooks/useGameState'
import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemContent, ItemTitle } from '../ui/item'
import { ButtonGroup } from '../ui/button-group'
import type { Position } from '@/game/types/player'
import { v4 } from 'uuid'

function DbAction({ action, sourceID }: { action: SAction; sourceID: string }) {
  const { state, pushAction } = useGameState((s) => s)
  const hasAction = !!state.actionQueue.find(
    (i) => i.context.sourceID === sourceID
  )

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{action.name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <ButtonGroup>
          {action.targets
            .get(state, {
              playerID: '',
              sourceID,
              positions: [],
              targetIDs: [],
            })
            .map(({ ID, target, type }) => (
              <Button
                key={ID}
                size="sm"
                variant="outline"
                disabled={hasAction}
                onClick={() => {
                  const position: Position = {
                    ID: v4(),
                    playerID: target.playerID,
                    index: 0,
                  }
                  pushAction(action, {
                    playerID: '',
                    sourceID,
                    positions: [position],
                    targetIDs: [],
                  })
                }}
              >
                {target.name}
              </Button>
            ))}
        </ButtonGroup>
      </ItemActions>
    </Item>
  )
}

export { DbAction }
