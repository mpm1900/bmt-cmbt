import { Actor } from '@/components/battle/actor'
import { ButtonGrid } from '@/components/button-grid'
import { PhaseController } from '@/components/battle/phase-controller'
import { Button } from '@/components/ui/button'
import { withEffects } from '@/game/actor'
import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowDownUp,
  Box,
  Circle,
  CircleOff,
  Component,
  MessageSquare,
} from 'lucide-react'
import { PhasePlanning } from '@/components/battle/phase-planning'
import { PhaseMain } from '@/components/battle/phase-main'
import { Swap } from '@/game/data/actions/swap'
import { PiNumberOne, PiNumberTwo, PiNumberThree } from 'react-icons/pi'
import { PhaseStart } from '@/components/battle/phase-start'
import { Item } from '@/components/ui/item'

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

  const player = state.players.find((p) => p.ID === playerID)!

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
        {state.turn.phase === 'start' && <PhaseStart />}
        {state.turn.phase === 'planning' && <PhasePlanning />}
        {state.turn.phase === 'main' && <PhaseMain />}
      </div>
      <div className="flex justify-start gap-2 m-2">
        <div className="flex self-center justify-self-center justify-center items-end gap-2 m-2">
          {player.activeActorIDs.map((actorID, i) => {
            if (!actorID)
              return (
                <Item
                  key={i}
                  variant="outline"
                  className="h-20 flex items-center justify-center text-muted-foreground border-dashed bg-muted/40"
                >
                  inactive
                </Item>
              )
            const afx = actors.find((a) => a[0].ID === actorID)!
            const [actor, effectIDs] = afx
            return (
              <Actor
                key={actorID}
                actor={actor}
                effects={effectIDs}
                active={activeActorID === actorID}
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
            )
          })}
        </div>
        <div className="flex flex-col items-center justify-end px-4 gap-1">
          <ButtonGrid className="grid grid-cols-2 grid-rows-2">
            <Button disabled variant="secondary" size="icon-lg">
              <MessageSquare />
            </Button>
            <Button
              variant={planningView === 'items' ? 'default' : 'secondary'}
              size="icon-lg"
              onClick={() => setUI({ planningView: 'items' })}
            >
              <Box />
            </Button>
            <Button
              variant={planningView === 'actions' ? 'default' : 'secondary'}
              size="icon-lg"
              onClick={() => setUI({ planningView: 'actions' })}
            >
              <Component />
            </Button>
            <Button
              variant={planningView === 'switch' ? 'default' : 'secondary'}
              size="icon-lg"
              onClick={() =>
                setUI({ planningView: 'switch', activeActionID: Swap.ID })
              }
            >
              <ArrowDownUp />
            </Button>
          </ButtonGrid>
          <span className="uppercase font-bold text-sm text-muted-foreground">
            Views
          </span>
        </div>
        <div className="flex flex-col items-center justify-end px-4 gap-1">
          <ButtonGrid>
            <Button size="icon-lg" variant="default" disabled>
              <PiNumberThree />
            </Button>
            <Button size="icon-lg" variant="default" disabled>
              <PiNumberTwo />
            </Button>
            <Button size="icon-lg" variant="default" disabled>
              <PiNumberOne />
            </Button>
            <Button size="icon-lg" variant="secondary" disabled>
              <Circle />
            </Button>
            <Button size="icon-lg" variant="ghost" disabled>
              <CircleOff />
            </Button>
            <Button size="icon-lg" variant="ghost" disabled>
              <CircleOff />
            </Button>
          </ButtonGrid>
          <span className="uppercase font-bold text-sm text-muted-foreground">
            Team
          </span>
        </div>
      </div>
    </div>
  )
}
