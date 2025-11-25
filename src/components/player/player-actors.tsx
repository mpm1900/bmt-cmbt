import { Actor } from './actor'
import { useGameState } from '@/hooks/useGameState'
import { nextAvailableAction } from '@/game/access'
import { useGameUI } from '@/hooks/useGameUI'
import type { SActionItem, SPlayer } from '@/game/state'
import { AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { isTargeted } from '@/game/queries'
import { newPosition } from '@/game/player'

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
    <div className="flex items-end justify-end gap-8 overflow-y-clip">
      {player.activeActorIDs.map((actorID, i) => (
        <div key={i} className="relative w-64 h-32 flex flex-col justify-end">
          <div
            className={cn(
              'rounded-xs h-19 mt-8 w-64 transition-all',
              ' bg-background/60 border border-background/80',
              { 'opacity-0': !!actorID }
            )}
          />
          <AnimatePresence>
            {actorID && (
              <Actor
                key={actorID}
                actorID={actorID}
                status={!planning ? '...' : 'select action'}
                active={
                  running &&
                  ((planning && activeActorID === actorID) ||
                    (!planning && current?.context.sourceID === actorID))
                }
                targeted={isTargeted(
                  state,
                  current?.context,
                  actorID!,
                  newPosition(player.ID, i)
                )}
                disabled={
                  !planning ||
                  !!state.actionQueue.find(
                    (a) => a.context.sourceID === actorID
                  )
                }
                onClick={(actor) => {
                  setUI({
                    activeActionID: nextAvailableAction(actor, state)?.ID,
                    activeActorID: actor.ID,
                  })
                }}
              />
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export { PlayerActors }
