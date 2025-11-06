import { Actor } from './actor'
import { useGameState } from '@/hooks/useGameState'
import { nextAvailableAction } from '@/game/access'
import { useGameUI } from '@/hooks/useGameUI'
import type { SActionItem, SPlayer } from '@/game/state'

function PlayerActors({
  player,
  current,
}: {
  player: SPlayer
  current: SActionItem | undefined
}) {
  const state = useGameState((s) => s.state)
  const { activeActorID, set: setUI } = useGameUI((s) => s)
  const phase = state.combat?.phase
  const planning = phase === 'planning'
  const running = !!phase && phase !== 'pre' && phase !== 'post'

  return (
    <div className="flex gap-2 items-end overflow-hidden">
      {player.activeActorIDs.map((actorID, i) => {
        const isactive = planning && activeActorID === actorID
        const issource = !planning && current?.context.sourceID === actorID
        return (
          <Actor
            key={actorID ?? i}
            actorID={actorID}
            status={!planning ? '...' : 'select action'}
            active={running && (isactive || issource)}
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
