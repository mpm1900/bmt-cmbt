import { withEffects } from '@/game/actor'
import { BrainBlast } from '@/game/data/actions/brain-blast'
import { DragonDance } from '@/game/data/actions/dragon-dance'
import { Fireball } from '@/game/data/actions/fireball'
import { Heal } from '@/game/data/actions/heal'
import { MagicMissile } from '@/game/data/actions/magic-missile'
import { useGameState } from '@/hooks/useGameState'
import { ActionPlanningBreadcrumbs } from './action-planning-breadcrumbs'
import { ActionSelectionCard } from './action-selection-card'
import { useGameUI } from '@/hooks/useGameUI'
import { Swap } from '@/game/data/actions/swap'
import { HotShots } from '@/game/data/actions/hot-shots'

const actions = [
  Fireball,
  MagicMissile,
  BrainBlast,
  Heal,
  DragonDance,
  HotShots,
]

function PhasePlanning() {
  const { state, pushAction } = useGameState((store) => store)
  const actors = state.actors.map((actor) => withEffects(actor, state.effects))
  const {
    activeActionID,
    activeActorID,
    planningView,
    set: setUI,
  } = useGameUI((s) => s)
  const activeActor = actors.find((actor) => actor[0].ID === activeActorID)?.[0]
  const activeAction = actions.find((action) => action.ID === activeActionID)

  if (!activeActor) return null
  return (
    <>
      {planningView === 'actions' && (
        <ActionSelectionCard
          source={activeActor}
          actions={actions}
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
      {planningView === 'switch' && (
        <ActionSelectionCard
          source={activeActor}
          actions={[Swap]}
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
    </>
  )
}

export { PhasePlanning }
