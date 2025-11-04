import { withStatEffects } from '@/game/access'
import type { SActionItem, SPlayer } from '@/game/state'
import { useGameState } from '@/hooks/useGameState'
import { Button } from '../ui/button'
import { EnemyActor } from './actor'
import { TbHexagon, TbHexagonFilled } from 'react-icons/tb'
import { Separator } from '../ui/separator'

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
    <div className="w-full flex flex-row-reverse justify-start items-start px-4 gap-2">
      {encounter.activeActorIDs.map((actorID, i) => {
        if (!actorID)
          return (
            <div key={i} className="flex flex-col gap-1">
              <Button
                disabled
                variant="stone-inactive"
                className="h-14 mb-6 w-48 flex items-center justify-center border border-foreground/10 border-dashed text-stone-300/30"
              >
                inactive
              </Button>
            </div>
          )
        const afx = actors.find((a) => a[0].ID === actorID)!
        const [actor, effects] = afx
        const issource = !planning && current?.context.sourceID === actorID
        const idTargeted =
          !planning && !!current?.context.targetIDs.includes(actorID)
        const posTargeted =
          !planning &&
          !!current?.context.positions.find(
            (p) => p.playerID === actor.playerID && p.index === i
          )

        return (
          <EnemyActor
            key={actorID}
            actor={actor}
            effects={effects}
            active={running && issource}
            targeted={idTargeted || posTargeted}
            onClick={() => {}}
          />
        )
      })}
      <div className="flex flex-col gap-1 items-end mt-3">
        <div className="grid grid-cols-3 gap-1 text-stone-300/40">
          {actors.map(([a]) =>
            a.state.alive ? (
              <TbHexagonFilled key={a.ID} />
            ) : (
              <TbHexagon key={a.ID} />
            )
          )}
        </div>
        <Separator />
        <div className="text-xs text-muted-foreground/50 uppercase">
          {actors.filter((a) => a[0].state.alive).length} Enemies left
        </div>
      </div>
    </div>
  )
}

export { EncounterActors }
