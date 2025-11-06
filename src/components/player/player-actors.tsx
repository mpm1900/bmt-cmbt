import { Actor } from './actor'
import { useGameState } from '@/hooks/useGameState'
import { nextAvailableAction } from '@/game/access'
import { useGameUI } from '@/hooks/useGameUI'
import type { SActionItem, SPlayer } from '@/game/state'
import { Button } from '../ui/button'
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
    <div
      className="grid items-end gap-2"
      style={{
        gridTemplateColumns: `repeat(${player.activeActorIDs.length}, 1fr)`,
      }}
    >
      {player.activeActorIDs.map((actorID, i) => (
        <div key={i} className="relative w-64 h-30 overflow-hidden">
          <Button
            disabled
            variant="slate-inactive"
            className={cn(
              'h-20 mb-5 mt-5 w-64 flex items-center justify-center border border-foreground/10 border-dashed',
              { hidden: !!actorID }
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
