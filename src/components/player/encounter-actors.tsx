import type { SActionItem, SPlayer } from '@/game/state'
import { useGameState } from '@/hooks/useGameState'
import { EnemyActor } from './actor'
import { TbHexagonFilled, TbHexagonOff } from 'react-icons/tb'
import { isTargeted } from '@/game/queries'
import { newPosition } from '@/game/player'
import { cn } from '@/lib/utils'
import { AnimatePresence } from 'motion/react'

function EncounterActors({
  encounter,
  current,
}: {
  encounter: SPlayer | undefined
  current: SActionItem | undefined
}) {
  const state = useGameState((s) => s.state)
  const actors = state.actors.filter((a) => a.playerID === encounter?.ID)
  const alive = actors.filter((a) => a.state.alive)
  const phase = useGameState((s) => s.state.combat?.phase)
  const planning = phase === 'planning'
  const running = !!phase && phase !== 'pre' && phase !== 'post'

  return (
    <div className="w-full flex flex-row justify-end items-start h-20 max-w-[1440px] px-4 gap-2">
      <div className="flex flex-col gap-0 items-end mt-3">
        <div className="grid grid-cols-3 gap-1 text-stone-300/40">
          {actors.map((a) =>
            a.state.alive ? (
              <TbHexagonFilled key={a.ID} />
            ) : (
              <TbHexagonOff key={a.ID} />
            )
          )}
        </div>
        {alive.length > 0 && (
          <div className="text-lg text-muted-foreground/50 title">
            {alive.length} enemies left
          </div>
        )}
      </div>
      {encounter?.activeActorIDs.map((actorID, i) => {
        return (
          <div key={i} className="relative h-20 w-48">
            <div
              className={cn(
                'rounded bg-background opacity-40 z-0 transition-all',
                'h-14 w-full mb-6 flex items-center justify-center border border-foreground/10 border-dashed text-stone-300/30',
                { 'opacity-0': !!actorID }
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
                    state.promptQueue.length === 0 &&
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
    </div>
  )
}

export { EncounterActors }
