import type { Player } from '@/game/types/player'
import { Actor } from './actor'
import { Button } from '../ui/button'
import { useGameState } from '@/hooks/useGameState'
import { nextAvailableAction, withStatEffects } from '@/game/access'
import { useGameUI } from '@/hooks/useGameUI'

function PlayerActors({ player }: { player: Player }) {
  const state = useGameState((s) => s.state)
  const {
    activeActionID,
    activeActorID,
    view,
    set: setUI,
  } = useGameUI((s) => s)
  const phase = state.combat?.phase
  const actors = state.actors
    .filter((a) => a.playerID === player.ID)
    .map((actor) => withStatEffects(actor, state.effects))
  return (
    <div className="flex gap-2 items-end">
      {player.activeActorIDs.map((actorID, i) => {
        if (!actorID)
          return (
            <div key={i} className="flex flex-col">
              <Button
                disabled
                variant="outline"
                className="h-20 mt-8 w-64 flex items-center justify-center text-muted-foreground border-dashed bg-muted/40"
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
              !!state.actionQueue.find((a) => a.context.sourceID === actor.ID)
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
  )
}

export { PlayerActors }
