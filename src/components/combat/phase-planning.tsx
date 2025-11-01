import { withEffects } from '@/game/actor'
import { useGameState } from '@/hooks/useGameState'
import { ActionPlanningBreadcrumbs } from './action-planning-breadcrumbs'
import { ActionSelectionCard } from './action-selection-card'
import { useGameUI } from '@/hooks/useGameUI'
import { Swap } from '@/game/data/actions/_system/swap'
import { CardHeader } from '../ui/card'
import { usePlayerID } from '@/hooks/usePlayer'

function PhasePlanning() {
  const playerID = usePlayerID()
  const { state, pushAction } = useGameState((store) => store)
  const player = state.players.find((p) => p.ID === playerID)!
  const actors = state.actors.map((actor) => withEffects(actor, state.effects))
  const {
    activeActionID,
    activeActorID,
    view,
    resetActive,
    set: setUI,
  } = useGameUI((s) => s)
  const activeActor = actors.find((actor) => actor[0].ID === activeActorID)?.[0]
  const activeAction = activeActor?.actions.find(
    (action) => action.ID === activeActionID
  )

  if (!activeActor) return null
  return (
    <>
      {view === 'actions' && (
        <ActionSelectionCard
          playerID={activeActor.playerID}
          source={activeActor}
          actions={activeActor.actions}
          activeActionID={activeActionID}
          onActiveActionIDChange={(activeActionID) => setUI({ activeActionID })}
          onActionConfirm={(action, context) => pushAction(action, context)}
        >
          <CardHeader>
            <ActionPlanningBreadcrumbs
              source={activeActor}
              action={activeAction}
            />
          </CardHeader>
        </ActionSelectionCard>
      )}
      {view === 'switch' && (
        <ActionSelectionCard
          playerID={activeActor.playerID}
          source={activeActor}
          actions={[Swap]}
          activeActionID={activeActionID}
          onActiveActionIDChange={(activeActionID) => setUI({ activeActionID })}
          onActionConfirm={(action, context) => {
            pushAction(action, context)
            setUI({ view: 'actions' })
            resetActive(state)
          }}
        >
          <CardHeader>
            <ActionPlanningBreadcrumbs
              source={activeActor}
              action={activeAction}
            />
          </CardHeader>
        </ActionSelectionCard>
      )}
      {view === 'items' && (
        <ActionSelectionCard
          playerID={activeActor.playerID}
          source={activeActor}
          actions={player.items
            .filter((i) => i.use || i.consumable)
            // TODO: factor in renderers here
            .map((i) => ({ ...(i.use || i.consumable)!, name: i.name }))}
          activeActionID={activeActionID}
          onActiveActionIDChange={(activeActionID) => setUI({ activeActionID })}
          onActionConfirm={(action, context) => {
            pushAction(action, context)
            setUI({ view: 'actions' })
            resetActive(state)
          }}
        >
          <CardHeader>
            <ActionPlanningBreadcrumbs
              source={activeActor}
              action={activeAction}
            />
          </CardHeader>
        </ActionSelectionCard>
      )}
    </>
  )
}

export { PhasePlanning }
