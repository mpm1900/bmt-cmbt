import { withStatEffects } from '@/game/access'
import type { SPlayer } from '@/game/state'
import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'
import { Button } from '../ui/button'
import { EnemyActor } from './actor'
import { ButtonGrid32 } from '../button-grid'
import { TbHexagonFilled } from 'react-icons/tb'

function EncounterActors({ encounter }: { encounter: SPlayer }) {
  const state = useGameState((s) => s.state)
  const { activeActorID } = useGameUI((s) => s)
  const phase = state.combat?.phase
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
                  className="h-14 w-48 flex items-center justify-center border border-foreground/10 border-dashed"
                >
                  inactive
                </Button>
              </div>
            )
          const afx = actors.find((a) => a[0].ID === actorID)!
          const [actor, effects] = afx

          return (
            <EnemyActor
              key={actorID}
              actor={actor}
              effects={effects}
              active={phase === 'planning' && activeActorID === actorID}
              onClick={() => {}}
            />
          )
        })}
      <ButtonGrid32 className="text-foreground/20">
        {actors.map(([a]) => (
          <TbHexagonFilled key={a.ID} />
        ))}
      </ButtonGrid32>
    </div>
  )
}

export { EncounterActors }
