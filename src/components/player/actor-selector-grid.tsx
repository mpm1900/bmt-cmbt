import { useGameState } from '@/hooks/useGameState'
import { ActorSelectorButton } from './actor-selector-button'
import { getPosition } from '@/game/player'
import { Dialog, DialogTrigger } from '../ui/dialog'
import { ActorDialog } from './actor-dialog'

function ActorSelectorGrid({ playerID }: { playerID: string }) {
  const { state } = useGameState((s) => s)
  const actors = state.actors.filter((actor) => actor.playerID === playerID)

  return (
    <div className="grid grid-cols-3 gap-px bg-background/40 rounded-xs p-0.5 border border-background/60">
      {actors.map((actor) => {
        return (
          <Dialog key={actor.ID}>
            <DialogTrigger asChild>
              <ActorSelectorButton
                actor={actor}
                position={getPosition(state, actor?.ID)}
                className="rounded-xs!"
              />
            </DialogTrigger>
            {actor && <ActorDialog actor={actor} />}
          </Dialog>
        )
      })}
    </div>
  )
}

export { ActorSelectorGrid }
