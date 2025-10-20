import { useGameState } from '@/hooks/useGameState'
import { ButtonGrid } from '../button-grid'
import { ActorSelectorButton } from './actor-selector-button'
import { getPosition } from '@/game/player'

function ActorSelectorGrid({ playerID }: { playerID: string }) {
  const { state } = useGameState((s) => s)
  const actors = state.actors.filter((actor) => actor.playerID === playerID)

  return (
    <ButtonGrid>
      {Array.from({ length: 6 }).map((_, index) => (
        <ActorSelectorButton
          key={index}
          actor={actors[index]}
          position={getPosition(state, actors[index]?.ID)}
        />
      ))}
    </ButtonGrid>
  )
}

export { ActorSelectorGrid }
