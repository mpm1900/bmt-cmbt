import { withEffects } from '@/game/actor'
import { useGameState } from '@/hooks/useGameState'
import { ActionPlanningBreadcrumbs } from './action-planning-breadcrumbs'
import { ActionSelectionCard } from './action-selection-card'
import { useGameUI } from '@/hooks/useGameUI'
import { Swap } from '@/game/data/actions/swap'

function PhasePlanning() {
  const { state, pushAction } = useGameState((store) => store)
  const actors = state.actors.map((actor) => withEffects(actor, state.effects))
  const {
    playerID,
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
          playerID={playerID}
          source={activeActor}
          actions={activeActor.actions}
          activeActionID={activeActionID}
          onActiveActionIDChange={(activeActionID) => setUI({ activeActionID })}
          onActionConfirm={(action, context) => pushAction(action, context)}
          breadcrumbs={
            <ActionPlanningBreadcrumbs
              source={activeActor}
              action={activeAction}
            />
          }
        />
      )}
      {view === 'switch' && (
        <ActionSelectionCard
          playerID={playerID}
          source={activeActor}
          actions={[Swap]}
          activeActionID={activeActionID}
          onActiveActionIDChange={(activeActionID) => setUI({ activeActionID })}
          onActionConfirm={(action, context) => {
            pushAction(action, context)
            setUI({ view: 'actions' })
            resetActive(state)
          }}
          breadcrumbs={
            <ActionPlanningBreadcrumbs
              source={activeActor}
              action={activeAction}
            />
          }
        />
      )}
    </>
  )
}

export { PhasePlanning }
