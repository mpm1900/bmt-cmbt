import { withStatEffects } from '@/game/access'
import type { SActionItem, SPlayer } from '@/game/state'
import { useGameState } from '@/hooks/useGameState'
import { Button } from '../ui/button'
import { EnemyActor } from './actor'
import { TbHexagonFilled } from 'react-icons/tb'

function EncounterActors({
  encounter,
  current,
}: {
  encounter: SPlayer
  current: SActionItem | undefined
}) {
  const state = useGameState((s) => s.state)
  const phase = state.combat?.phase
  const planning = phase === 'planning'
  const running = !!phase && phase !== 'pre' && phase !== 'post'
  const actors = state.actors
    .filter((a) => a.playerID === encounter.ID)
    .map((actor) => withStatEffects(actor, state.effects))

  return (
    <div className="w-full flex flex-row-reverse justify-start items-start p-4 pt-0 gap-2">
      {encounter.activeActorIDs
        .slice()
        .reverse()
        .map((actorID, i) => {
          if (!actorID)
            return (
              <div key={i} className="flex flex-col gap-1">
                <Button
                  disabled
                  variant="stone-inactive"
                  className="h-14 w-48 flex items-center justify-center border border-foreground/10 border-dashed text-stone-300/30"
                >
                  inactive
                </Button>
              </div>
            )
          const afx = actors.find((a) => a[0].ID === actorID)!
          const [actor, effects] = afx
          const issource = !planning && current?.context.sourceID === actorID

          return (
            <EnemyActor
              key={actorID}
              actor={actor}
              effects={effects}
              active={running && issource}
              onClick={() => {}}
            />
          )
        })}
      <div className="grid grid-cols-3 gap-1 text-stone-300/40">
        {actors.map(([a]) => (
          <TbHexagonFilled key={a.ID} />
        ))}
      </div>
    </div>
  )
}

export { EncounterActors }
