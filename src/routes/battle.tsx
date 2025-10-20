import { Actor, EnemyActor } from '@/components/battle/actor'
import { PhaseController } from '@/components/battle/phase-controller'
import { Button } from '@/components/ui/button'
import { withEffects } from '@/game/actor'
import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'
import { createFileRoute } from '@tanstack/react-router'
import { PhasePlanning } from '@/components/battle/phase-planning'
import { PhaseMain } from '@/components/battle/phase-main'
import { PhaseStart } from '@/components/battle/phase-start'
import { ActorSelectorGrid } from '@/components/battle/actor-selector-grid'
import { BattleViewGrid } from '@/components/battle/battle-view-grid'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ButtonGroup } from '@/components/ui/button-group'

export const Route = createFileRoute('/battle')({
  component: RouteComponent,
})

function RouteComponent() {
  const { state, next, nextPhase } = useGameState((store) => store)
  const actors = state.actors.map((actor) => withEffects(actor, state.effects))
  const { activeActorID, playerID, set: setUI } = useGameUI((s) => s)

  const player = state.players.find((p) => p.ID === playerID)!
  const ai = state.players.find((p) => p.ID !== playerID)!

  // bg-[url('./public/platforms.jpg')]
  return (
    <div className="h-screen w-screen flex flex-col items-between  bg-cover bg-no-repeat">
      <PhaseController />
      {ai && (
        <div className="w-full flex flex-row-reverse justify-start items-end p-4 gap-2">
          {ai.activeActorIDs.map((actorID, i) => {
            if (!actorID)
              return (
                <div key={i} className="flex flex-col gap-1">
                  <Button
                    disabled
                    variant="outline"
                    className="h-14 w-48 flex items-center justify-center text-muted-foreground border-dashed bg-muted/40"
                  >
                    inactive
                  </Button>
                </div>
              )
            const afx = actors.find((a) => a[0].ID === actorID)!
            const [actor, effectIDs] = afx

            return (
              <EnemyActor
                key={actorID}
                actor={actor}
                effects={effectIDs}
                active={
                  state.battle?.phase === 'planning' &&
                  activeActorID === actorID
                }
                onClick={() => {
                  setUI({
                    activeActionID: actor.actions[0]?.ID,
                    activeActorID: actor.ID,
                  })
                }}
              />
            )
          })}
        </div>
      )}

      {state.battle && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex gap-4">
            {state.battle.phase === 'start' && <PhaseStart />}
            {state.battle.phase === 'planning' && <PhasePlanning />}
            {state.battle.phase === 'main' && <PhaseMain />}
            <Card>
              <CardHeader>Debug</CardHeader>
              <CardContent>
                <div>Actions: {state.actionQueue.length}</div>
                <div>Prompts: {state.promptQueue.length}</div>
                <div>Triggers: {state.triggerQueue.length}</div>
                <div>Mutations: {state.mutationQueue.length}</div>
                <div>Phase: {state.battle?.phase}</div>
                <ButtonGroup>
                  <Button variant="outline" onClick={next}>
                    Next
                  </Button>
                  <Button variant="outline" onClick={nextPhase}>
                    Next Phase
                  </Button>
                </ButtonGroup>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <div className="flex justify-start gap-2 m-2">
        <div className="flex flex-col items-center px-4 gap-1">
          <div className="flex self-center justify-self-center justify-center items-end gap-2">
            {player.activeActorIDs.map((actorID, i) => {
              if (!actorID)
                return (
                  <div key={i} className="flex flex-col gap-1">
                    <Button
                      disabled
                      variant="outline"
                      className="h-20 w-64 flex items-center justify-center text-muted-foreground border-dashed bg-muted/40"
                    >
                      inactive
                    </Button>
                    <span className="uppercase font-bold text-sm text-muted-foreground/40 text-center opacity-0">
                      -
                    </span>
                  </div>
                )
              const afx = actors.find((a) => a[0].ID === actorID)!
              const [actor, effectIDs] = afx
              const planning = state.battle?.phase === 'planning'
              const active = planning && activeActorID === actorID
              const done = !!state.actionQueue.find(
                (a) => a.context.sourceID === actor.ID
              )
              const status = active ? 'active' : done ? '...' : 'select action'
              return (
                <Actor
                  key={actorID}
                  actor={actor}
                  effects={effectIDs}
                  status={planning ? status : '...'}
                  active={
                    state.battle?.phase === 'planning' &&
                    activeActorID === actorID
                  }
                  disabled={
                    state.battle?.phase !== 'planning' ||
                    !!state.actionQueue.find(
                      (a) => a.context.sourceID === actor.ID
                    )
                  }
                  onClick={() => {
                    setUI({
                      activeActionID: actor.actions[0]?.ID,
                      activeActorID: actor.ID,
                    })
                  }}
                />
              )
            })}
          </div>
        </div>
        <div className="flex flex-col items-center justify-end px-4 gap-1">
          <BattleViewGrid />
          <span className="uppercase font-bold text-xs text-muted-foreground">
            Views
          </span>
        </div>
        <div className="flex flex-col items-center justify-end px-4 gap-1">
          <ActorSelectorGrid playerID={playerID} />
          <span className="uppercase font-bold text-xs text-muted-foreground">
            Team
          </span>
        </div>
      </div>
    </div>
  )
}
