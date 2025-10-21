import { useGameState } from '@/hooks/useGameState'
import { createFileRoute, Link } from '@tanstack/react-router'
import { withEffects } from '@/game/actor'
import { useGameUI } from '@/hooks/useGameUI'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { state } = useGameState((state) => state)
  const { playerID } = useGameUI((s) => s)
  const actors = state.actors
    .filter((actor) => actor.playerID === playerID)
    .map((actor) => withEffects(actor, state.effects))
  console.log(actors)

  return (
    <div className="flex gap-4">
      <Link to="/battle">to battle</Link>
    </div>
  )
}
