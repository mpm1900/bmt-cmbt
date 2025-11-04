import { withEffects } from '@/game/actor'
import { useGameState } from '@/hooks/useGameState'
import { ActionSelectionCard } from './action-selection-card'
import { useGameUI } from '@/hooks/useGameUI'
import { Swap } from '@/game/data/actions/_system/swap'
import { usePlayerID } from '@/hooks/usePlayer'
import { TabsContent } from '../ui/tabs'
import { getItemAction, groupItems } from '@/game/player'

function PhasePlanning() {
  const playerID = usePlayerID()
  const { state, pushAction } = useGameState((store) => store)
  const { activeActionID, activeActorID, set: setUI } = useGameUI((s) => s)
  const player = state.players.find((p) => p.ID === playerID)!
  const actors = state.actors.map((actor) => withEffects(actor, state.effects))
  const activeActor = actors.find((actor) => actor[0].ID === activeActorID)?.[0]
  const items = player.items.filter((i) => i.use || i.consumable)
  const counts = groupItems(items)
  const itemActions = Object.entries(counts).map(
    ([id]) => getItemAction(items.find((i) => i.name === id)!)!
  )

  if (!activeActor) return null

  return (
    <>
      <TabsContent value="actions">
        <ActionSelectionCard
          playerID={activeActor.playerID}
          source={activeActor}
          actions={activeActor.actions.concat(Swap)}
          activeActionID={activeActionID}
          onActiveActionIDChange={(activeActionID) => setUI({ activeActionID })}
          onActionConfirm={(action, context) => pushAction(action, context)}
        />
      </TabsContent>
      <TabsContent value="items">
        <ActionSelectionCard
          playerID={activeActor.playerID}
          source={activeActor}
          actions={itemActions}
          activeActionID={activeActionID}
          onActiveActionIDChange={(activeActionID) => setUI({ activeActionID })}
          onActionConfirm={(action, context) => pushAction(action, context)}
        />
      </TabsContent>
    </>
  )
}

export { PhasePlanning }
