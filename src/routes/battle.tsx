import { Actor } from '@/components/battle/actor'
import { ButtonGrid } from '@/components/button-grid'
import { PhaseController } from '@/components/battle/phase-controller'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { withEffects } from '@/game/actor'
import { BrainBlast } from '@/game/data/actions/brain-blast'
import { DragonDance } from '@/game/data/actions/dragon-dance'
import { Fireball } from '@/game/data/actions/fireball'
import { Heal } from '@/game/data/actions/heal'
import { MagicMissile } from '@/game/data/actions/magic-missile'
import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowDownUp, Box, CircleSmall, FoldVertical } from 'lucide-react'
import { ActionSelectionCard } from '@/components/battle/action-selection-card'
import { ActionPlanningBreadcrumbs } from '@/components/battle/action-planning-breadcrumbs'

export const Route = createFileRoute('/battle')({
  component: RouteComponent,
})

const actions = [Fireball, MagicMissile, BrainBlast, Heal, DragonDance]

function RouteComponent() {
  const { state, pushAction, next } = useGameState((store) => store)
  const actors = state.actors.map((actor) => withEffects(actor, state.effects))
  const {
    activeActionID,
    activeActorID,
    planningView,
    set: setUI,
  } = useGameUI((s) => s)
  const activeActor = actors.find((actor) => actor[0].ID === activeActorID)?.[0]
  const activeAction = actions.find((action) => action.ID === activeActionID)

  // bg-[url('./public/platforms.jpg')]
  return (
    <div className="h-screen w-screen flex flex-col items-between  bg-cover bg-no-repeat">
      <PhaseController />
      <div>
        <div>Phase: {state.turn.phase}</div>
        <div>Actions: {state.actionQueue.queue.length}</div>
        <div>Triggers: {state.triggerQueue.queue.length}</div>
        <div>Mutations: {state.mutationQueue.queue.length}</div>
        <Button onClick={next}>Next</Button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        {activeActor && state.turn.phase === 'planning' && (
          <ActionSelectionCard
            source={activeActor}
            actions={actions}
            activeActionID={activeActionID}
            onActiveActionIDChange={(activeActionID) =>
              setUI({ activeActionID })
            }
            onActionConfirm={(action, context) => pushAction(action, context)}
            breadcrumbs={
              activeAction && (
                <ActionPlanningBreadcrumbs
                  source={activeActor}
                  action={activeAction}
                />
              )
            }
          />
        )}
      </div>
      <div className="flex justify-start gap-2 my-2">
        <div className="flex flex-col items-center justify-end p-4 gap-1">
          <ButtonGroup>
            <Button
              variant={planningView === 'items' ? 'default' : 'secondary'}
              size="icon-lg"
              onClick={() => setUI({ planningView: 'items' })}
            >
              <Box />
            </Button>
            <ButtonGroupSeparator />
            <Button
              variant={planningView === 'actions' ? 'default' : 'secondary'}
              size="icon-lg"
              onClick={() => setUI({ planningView: 'actions' })}
            >
              <FoldVertical />
            </Button>
            <ButtonGroupSeparator />
            <Button
              variant={planningView === 'switch' ? 'default' : 'secondary'}
              size="icon-lg"
              onClick={() => setUI({ planningView: 'switch' })}
            >
              <ArrowDownUp />
            </Button>
          </ButtonGroup>
          <span className="uppercase font-bold text-sm text-muted-foreground">
            Views
          </span>
        </div>
        <div className="flex self-center justify-self-center justify-center gap-2 my-2">
          {actors
            .filter((a) => a[0].playerID === state.players[0].ID)
            .map(([actor, effects]) => (
              <Actor
                key={actor.ID}
                actor={actor}
                effects={effects}
                active={activeActorID === actor.ID}
                disabled={state.turn.phase !== 'planning'}
                onClick={() => {
                  setUI({
                    activeActionID: undefined,
                    activeActorID: actor.ID,
                  })
                }}
              />
            ))}
        </div>
        <div className="flex flex-col justify-end p-4">
          <ButtonGrid grid={[2, 3]}>
            <Button size="icon-sm" variant="default">
              <CircleSmall />
            </Button>
            <Button size="icon-sm" variant="default">
              <CircleSmall />
            </Button>
            <Button size="icon-sm" variant="default">
              <CircleSmall />
            </Button>
            <Button size="icon-sm" variant="secondary">
              <CircleSmall />
            </Button>
            <Button size="icon-sm" variant="secondary" disabled>
              <CircleSmall />
            </Button>
            <Button size="icon-sm" variant="secondary" disabled>
              <CircleSmall />
            </Button>
          </ButtonGrid>
        </div>
      </div>
    </div>
  )
}
