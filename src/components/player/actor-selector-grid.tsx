import { useGameState } from '@/hooks/useGameState'
import { ButtonGrid } from '../button-grid'
import { ActorSelectorButton } from './actor-selector-button'
import { getPosition } from '@/game/player'
import { Dialog, DialogTrigger } from '../ui/dialog'
import { ActorDialog } from './actor-dialog'

function ActorSelectorGrid({ playerID }: { playerID: string }) {
  const { state } = useGameState((s) => s)
  const actors = state.actors.filter((actor) => actor.playerID === playerID)

  return (
    <ButtonGrid>
      {Array.from({ length: 6 }).map((_, index) => {
        const actor = actors[index]
        return (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <ActorSelectorButton
                actor={actor}
                position={getPosition(state, actor?.ID)}
              />
            </DialogTrigger>
            {actor && <ActorDialog actor={actor} />}
          </Dialog>
        )
      })}
    </ButtonGrid>
  )
}

export { ActorSelectorGrid }
