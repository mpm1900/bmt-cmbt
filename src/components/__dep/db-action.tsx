import type { SAction } from '@/game/state'
import { useGameState } from '@/hooks/useGameState'
import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemContent, ItemTitle } from '../ui/item'
import { ButtonGroup } from '../ui/button-group'

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
            .get(state, { sourceID, targetIDs: [] })
            .map((target) => (
              <Button
                key={target.ID}
                size="sm"
                variant="outline"
                disabled={hasAction}
                onClick={() =>
                  pushAction(action, { sourceID, targetIDs: [target.ID] })
                }
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
