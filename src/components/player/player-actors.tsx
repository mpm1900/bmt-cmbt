import { Actor } from './actor'
import { useGameState } from '@/hooks/useGameState'
import { nextAvailableAction } from '@/game/access'
import { useGameUI } from '@/hooks/useGameUI'
import type { SActionItem, SPlayer } from '@/game/state'
import { AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

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
    <div className="flex items-end justify-end gap-2">
      {player.activeActorIDs.map((actorID, i) => (
        <div key={i} className="relative w-64 h-32 overflow-hidden">
          <div
            className={cn(
              'rounded-lg h-19 mb-4 mt-8 w-64 flex items-center justify-center transition-all',
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
