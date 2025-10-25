import { Actor, EnemyActor } from '@/components/combat/actor'
import { PhaseController } from '@/components/combat/phase-controller'
import { Button } from '@/components/ui/button'
import { useGamePhase, useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'
import { createFileRoute } from '@tanstack/react-router'
import { ActorSelectorGrid } from '@/components/combat/actor-selector-grid'
import { ViewSelector } from '@/components/view-selector'
import { getStatus } from '@/game/next'
import { Badge } from '@/components/ui/badge'
import { CombatPhases } from '@/game/state'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { CombatView } from '@/components/combat/combat-view'
import { nextAvailableAction, withStatEffects } from '@/game/access'
import { DialogView } from '@/components/dialog/dialog-view'
import { cn } from '@/lib/utils'
import { DialogController } from '@/components/dialog/dialog-controller'

export const Route = createFileRoute('/battle')({
  component: RouteComponent,
})

function RouteComponent() {
  const { state } = useGameState((store) => store)
  const phase = useGamePhase()

  const actors = state.actors.map((actor) =>
    withStatEffects(actor, state.effects)
  )
  const {
    activeActorID,
    activeActionID,
    playerID,
    view,
    set: setUI,
  } = useGameUI((s) => s)

  const player = state.players.find((p) => p.ID === playerID)!
  const ai = state.players.find((p) => p.ID !== playerID)!

  // bg-[url('./public/platforms.jpg')]
  return (
    <div className="h-screen w-screen flex flex-col items-between  bg-cover bg-no-repeat">
      <div className="flex items-center justify-start gap-2 p-1">
        <Separator orientation="vertical" />
        <Badge variant="outline" className="text-muted-foreground">
          Dialog
        </Badge>
        <Badge variant="secondary">Combat</Badge>
        {state.combat && (
          <>
            <Separator orientation="vertical" />
            <Badge variant="secondary">Turn {state.combat.turn}</Badge>
            <Separator orientation="vertical" />
            {CombatPhases.filter((p) => p !== 'pre' && p !== 'post').map(
              (p) => (
                <Badge
                  key={p}
                  variant={p === phase ? 'secondary' : 'outline'}
                  className={cn({
                    'text-muted-foreground': p !== phase,
                  })}
                >
                  {p}
                </Badge>
              )
            )}
          </>
        )}
        <Separator orientation="vertical" />
        {getStatus(state) === 'running' && <Spinner />}
      </div>
      <PhaseController />
      <DialogController />
      {ai && (
        <div className="w-full flex flex-row-reverse justify-start items-end p-4 gap-2">
          {ai.activeActorIDs.map((actorID, i) => {
            if (!actorID)
              return (
                <div key={i} className="flex flex-col gap-1">
                  <Button
                    disabled
                    variant="outline"
                    className="h-12 w-48 flex items-center justify-center text-muted-foreground border-dashed bg-muted/40"
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
                active={phase === 'planning' && activeActorID === actorID}
                onClick={() => {
                  setUI({
                    activeActionID: nextAvailableAction(actor, state)?.ID,
                    activeActorID: actor.ID,
                  })
                }}
              />
            )
          })}
        </div>
      )}

      {state.combat && <CombatView />}
      {view === 'dialog' && <DialogView />}

      <div className="flex justify-start gap-2 m-2">
        <div className="flex flex-col items-center px-4">
          <div className="flex gap-2 items-end">
            {player.activeActorIDs.map((actorID, i) => {
              if (!actorID)
                return (
                  <div key={i} className="flex flex-col">
                    <Button
                      disabled
                      variant="outline"
                      className="h-20 w-64 flex items-center justify-center text-muted-foreground border-dashed bg-muted/40"
                    >
                      inactive
                    </Button>
                    <span className="uppercase font-bold text-xs text-muted-foreground/40 text-center opacity-0">
                      ...
                    </span>
                  </div>
                )
              const afx = actors.find((a) => a[0].ID === actorID)!
              const [actor, effectIDs] = afx
              const planning = phase === 'planning'
              // const active = planning && activeActorID === actorID
              const done = !!state.actionQueue.find(
                (a) => a.context.sourceID === actor.ID
              )
              const status = done ? '...' : 'select action'
              return (
                <Actor
                  key={actorID}
                  actor={actor}
                  effects={effectIDs}
                  status={planning ? status : '...'}
                  active={phase === 'planning' && activeActorID === actorID}
                  disabled={
                    phase !== 'planning' ||
                    !!state.actionQueue.find(
                      (a) => a.context.sourceID === actor.ID
                    )
                  }
                  onClick={() => {
                    setUI({
                      activeActionID:
                        view === 'actions'
                          ? nextAvailableAction(actor, state)?.ID
                          : activeActionID,
                      activeActorID: actor.ID,
                    })
                  }}
                />
              )
            })}
          </div>
        </div>
        <div className="flex flex-col items-center justify-end px-4 gap-1">
          <ViewSelector />
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
