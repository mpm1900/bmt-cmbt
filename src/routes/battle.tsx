import { Actor, EnemyActor } from '@/components/battle/actor'
import { PhaseController } from '@/components/battle/phase-controller'
import { Button } from '@/components/ui/button'
import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'
import { createFileRoute } from '@tanstack/react-router'
import { ActorSelectorGrid } from '@/components/battle/actor-selector-grid'
import { BattleViewGrid } from '@/components/battle/battle-view-grid'
import { getStatus } from '@/game/next'
import { Badge } from '@/components/ui/badge'
import { BattlePhases } from '@/game/state'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { BattleView } from '@/components/battle/battle-view'
import { nextAvailableAction, withStatEffects } from '@/game/access'
import { DialogView } from '@/components/dialog/dialog-view'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/battle')({
  component: RouteComponent,
})

function RouteComponent() {
  const { state } = useGameState((store) => store)
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
        {state.battle && (
          <>
            <Separator orientation="vertical" />
            <Badge variant="secondary">Turn {state.battle.turn}</Badge>
            <Separator orientation="vertical" />
            {BattlePhases.filter((p) => p !== 'pre' && p !== 'post').map(
              (phase) => (
                <Badge
                  key={phase}
                  variant={
                    state.battle?.phase === phase ? 'secondary' : 'outline'
                  }
                  className={cn({
                    'text-muted-foreground': state.battle?.phase !== phase,
                  })}
                >
                  {phase}
                </Badge>
              )
            )}
          </>
        )}
        <Separator orientation="vertical" />
        {getStatus(state) === 'running' && <Spinner />}
      </div>
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
                active={
                  state.battle?.phase === 'planning' &&
                  activeActorID === actorID
                }
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

      {state.battle && <BattleView />}
      {view === 'dialog' && <DialogView />}
      {view === 'dialog' && <div className="flex-1 h-full" />}

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
