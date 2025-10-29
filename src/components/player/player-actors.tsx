import { Actor } from './actor'
import { useGameState } from '@/hooks/useGameState'
import { nextAvailableAction } from '@/game/access'
import { useGameUI } from '@/hooks/useGameUI'
import type { SPlayer } from '@/game/state'

function PlayerActors({ player }: { player: SPlayer }) {
  const state = useGameState((s) => s.state)
  const {
    activeActionID,
    activeActorID,
    view,
    set: setUI,
  } = useGameUI((s) => s)
  const phase = state.combat?.phase
  const planning = phase === 'planning'

  return (
    <div className="flex gap-2 items-end px-6">
      {player.activeActorIDs.map((actorID, i) => {
        return (
          <Actor
            key={actorID ?? i}
            actorID={actorID}
            status={!planning ? '...' : 'select action'}
            active={planning && activeActorID === actorID}
            disabled={
              !planning ||
              !!state.actionQueue.find((a) => a.context.sourceID === actorID)
            }
            onClick={(actor) => {
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
