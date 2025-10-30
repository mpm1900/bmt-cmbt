import { withStatEffects } from '@/game/access'
import type { SPlayer } from '@/game/state'
import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'
import { Button } from '../ui/button'
import { EnemyActor } from './actor'

function EncounterActors({ encounter }: { encounter: SPlayer }) {
  const state = useGameState((s) => s.state)
  const { activeActorID } = useGameUI((s) => s)
  const phase = state.combat?.phase
  const actors = state.actors
    .filter((a) => a.playerID === encounter.ID)
    .map((actor) => withStatEffects(actor, state.effects))
  return (
    <div className="w-full flex flex-row-reverse justify-start items-start p-4 pt-0 gap-2">
      {encounter.activeActorIDs.map((actorID, i) => {
        if (!actorID)
          return (
            <div key={i} className="flex flex-col gap-1">
              <Button
                disabled
                variant="outline"
                className="h-14 w-48 flex items-center justify-center text-muted-foreground border-dashed bg-muted/40"
              >
                inactive
              </Button>
            </div>
          )
        const afx = actors.find((a) => a[0].ID === actorID)!
        const [actor, effectIDs] = afx

        return (
          <EnemyActor
            key={actorID}
            actor={actor}
            effectIDs={effectIDs}
            active={phase === 'planning' && activeActorID === actorID}
            onClick={() => {}}
          />
        )
      })}
    </div>
  )
}

export { EncounterActors }
