import { Actor } from '@/components/battle/actor'
import { ButtonGrid } from '@/components/button-grid'
import { PhaseController } from '@/components/battle/phase-controller'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { withEffects } from '@/game/actor'
import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowDownUp, Box, Circle, CircleOff, FoldVertical } from 'lucide-react'
import { PhasePlanning } from '@/components/battle/phase-planning'
import { PhaseMain } from '@/components/battle/phase-main'
import { Swap } from '@/game/data/actions/swap'
import { PiNumberOne, PiNumberTwo, PiNumberThree } from 'react-icons/pi'

export const Route = createFileRoute('/battle')({
  component: RouteComponent,
})

function RouteComponent() {
  const { state, next, nextPhase } = useGameState((store) => store)
  const actors = state.actors.map((actor) => withEffects(actor, state.effects))
  const {
    activeActorID,
    planningView,
    playerID,
    set: setUI,
  } = useGameUI((s) => s)

  // bg-[url('./public/platforms.jpg')]
  return (
    <div className="h-screen w-screen flex flex-col items-between  bg-cover bg-no-repeat">
      <PhaseController />
      <div>
        <div>Phase: {state.turn.phase}</div>
        <div>Actions: {state.actionQueue.length}</div>
        <div>Prompts: {state.promptQueue.length}</div>
        <div>Triggers: {state.triggerQueue.length}</div>
        <div>Mutations: {state.mutationQueue.length}</div>
        <Button onClick={next}>Next</Button>
        <Button onClick={nextPhase}>Next Phase</Button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        {state.turn.phase === 'planning' && <PhasePlanning />}
        {state.turn.phase === 'main' && <PhaseMain />}
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
              onClick={() =>
                setUI({ planningView: 'switch', activeActionID: Swap.ID })
              }
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
            .filter(([a]) => a.playerID === playerID && a.state.active)
            .map(([actor, effects]) => (
              <Actor
                key={actor.ID}
                actor={actor}
                effects={effects}
                active={activeActorID === actor.ID}
                disabled={
                  state.turn.phase !== 'planning' ||
                  !!state.actionQueue.find(
                    (a) => a.context.sourceID === actor.ID
                  )
                }
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
          <ButtonGrid>
            <Button size="icon-sm" variant="default" disabled>
              <PiNumberThree />
            </Button>
            <Button size="icon-sm" variant="default" disabled>
              <PiNumberTwo />
            </Button>
            <Button size="icon-sm" variant="default" disabled>
              <PiNumberOne />
            </Button>
            <Button size="icon-sm" variant="secondary" disabled>
              <Circle />
            </Button>
            <Button size="icon-sm" variant="ghost" disabled>
              <CircleOff />
            </Button>
            <Button size="icon-sm" variant="ghost" disabled>
              <CircleOff />
            </Button>
          </ButtonGrid>
        </div>
      </div>
    </div>
  )
}
