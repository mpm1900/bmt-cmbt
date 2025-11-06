import type { SActionItem, SPlayer } from '@/game/state'
import { useGameState } from '@/hooks/useGameState'
import { EnemyActor } from './actor'
import { TbHexagonFilled, TbHexagonOff } from 'react-icons/tb'
import { Separator } from '../ui/separator'
import { isTargeted } from '@/game/queries'
import { newPosition } from '@/game/player'
import { cn } from '@/lib/utils'
import { AnimatePresence } from 'motion/react'

function EncounterActors({
  encounter,
  current,
}: {
  encounter: SPlayer
  current: SActionItem | undefined
}) {
  const state = useGameState((s) => s.state)
  const actors = state.actors.filter((a) => a.playerID === encounter.ID)
  const phase = useGameState((s) => s.state.combat?.phase)
  const planning = phase === 'planning'
  const running = !!phase && phase !== 'pre' && phase !== 'post'

  return (
    <div className="w-full flex flex-row-reverse justify-start items-start px-4 gap-2">
      {encounter.activeActorIDs.map((actorID, i) => {
        return (
          <div key={i} className="relative h-14 w-48">
            <div
              className={cn(
                'rounded bg-stone-900 opacity-40 z-0',
                'h-full w-full mb-6 flex items-center justify-center border border-foreground/10 border-dashed text-stone-300/30'
              )}
            />
            <AnimatePresence>
              {actorID && (
                <EnemyActor
                  key={actorID}
                  actorID={actorID}
                  active={
                    running &&
                    !planning &&
                    current?.context.sourceID === actorID
                  }
                  targeted={isTargeted(
                    state,
                    current?.context,
                    actorID!,
                    newPosition(encounter.ID, i)
                  )}
                />
              )}
            </AnimatePresence>
          </div>
        )
      })}
      <div className="flex flex-col gap-1 items-end mt-3">
        <div className="grid grid-cols-3 gap-1 text-stone-300/40">
          {actors.map((a) =>
            a.state.alive ? (
              <TbHexagonFilled key={a.ID} />
            ) : (
              <TbHexagonOff key={a.ID} />
            )
          )}
        </div>
        <Separator />
        <div className="text-xs text-muted-foreground/50 uppercase">
          {actors.filter((a) => a.state.alive).length} Enemies left
        </div>
      </div>
    </div>
  )
}

export { EncounterActors }
