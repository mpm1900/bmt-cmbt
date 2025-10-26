import { useGameState } from '@/hooks/useGameState'
import { ActionSelectionCard } from './action-selection-card'
import { getActor } from '@/game/access'
import { CardHeader, CardTitle } from '../ui/card'
import { usePlayerID } from '@/hooks/usePlayer'

function PhasePre() {
  const { state, resolvePrompt } = useGameState((s) => s)
  const playerID = usePlayerID()
  const prompt = state.promptQueue[0]

  if (prompt && prompt.context.playerID === playerID) {
    const action = prompt.action
    const context = prompt.context
    const source = getActor(state, context.sourceID)
    return (
      <ActionSelectionCard
        key={prompt.ID}
        playerID={context.playerID}
        source={source}
        actions={[action]}
        activeActionID={action.ID}
        onActiveActionIDChange={() => {}}
        onActionConfirm={(_action, context) => {
          resolvePrompt(context)
        }}
      >
        <CardHeader>
          <CardTitle>Combat Initiated</CardTitle>
        </CardHeader>
      </ActionSelectionCard>
    )
  }

  return null
}

export { PhasePre }
