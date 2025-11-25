import { withEffects } from '@/game/queries'
import { useGameState } from '@/hooks/useGameState'
import { ActionSelectionCard } from './action-selection-card'
import { useGameUI } from '@/hooks/useGameUI'
import { Swap } from '@/game/data/actions/_system/swap'
import { CardHeader, CardTitle } from '../ui/card'

function PhasePlanning() {
  const { state, pushAction } = useGameState((store) => store)
  const { activeActionID, activeActorID, set: setUI } = useGameUI((s) => s)
  const actors = state.actors.map((actor) => withEffects(actor, state.effects))
  const activeActor = actors.find((actor) => actor.ID === activeActorID)

  if (!activeActor) return null

  return (
    <>
      <ActionSelectionCard
        playerID={activeActor.playerID}
        source={activeActor}
        actions={activeActor.actions.concat(Swap)}
        activeActionID={activeActionID}
        onActiveActionIDChange={(activeActionID) => setUI({ activeActionID })}
        onActionConfirm={(action, context) => pushAction(action, context)}
      >
        <CardHeader>
          <CardTitle className="text-center">Choose an Action</CardTitle>
        </CardHeader>
      </ActionSelectionCard>
    </>
  )
}

export { PhasePlanning }
