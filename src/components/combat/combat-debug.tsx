import { useGameState } from '@/hooks/useGameState'
import { ButtonGroup } from '../ui/button-group'
import { Button } from '../ui/button'

function CombatDebug() {
  const { state, next, nextPhase } = useGameState((s) => s)

  return (
    <div>
      <div>Actions: {state.actionQueue.length}</div>
      <div>Prompts: {state.promptQueue.length}</div>
      <div>Triggers: {state.triggerQueue.length}</div>
      <div>Mutations: {state.mutationQueue.length}</div>
      <ButtonGroup>
        <Button variant="outline" onClick={next}>
          Next
        </Button>
        <Button variant="outline" onClick={nextPhase}>
          Next Phase
        </Button>
      </ButtonGroup>
    </div>
  )
}

export { CombatDebug }
