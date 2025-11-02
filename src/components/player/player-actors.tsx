import { Actor } from './actor'
import { useGameState } from '@/hooks/useGameState'
import { nextAvailableAction } from '@/game/access'
import { useGameUI } from '@/hooks/useGameUI'
import type { SPlayer } from '@/game/state'

function PlayerActors({ player }: { player: SPlayer }) {
  const state = useGameState((s) => s.state)
  const { activeActorID, set: setUI } = useGameUI((s) => s)
  const phase = state.combat?.phase
  const planning = phase === 'planning'

  return (
    <div className="flex gap-2 items-end">
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
                activeActionID: nextAvailableAction(actor, state)?.ID,
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
