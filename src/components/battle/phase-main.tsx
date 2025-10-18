import { useGameState } from '@/hooks/useGameState'
import { ActionSelectionCard } from './action-selection-card'
import { getActor } from '@/game/access'

function PhaseMain() {
  const { state, pushPromptAction } = useGameState((s) => s)
  if (state.promptQueue.active) {
    const action = state.promptQueue.active.action
    console.log('context', state.promptQueue.active.context)
    const source = getActor(state, state.promptQueue.active.context.sourceID)
    return (
      <ActionSelectionCard
        source={source}
        actions={[action]}
        activeActionID={action.ID}
        onActiveActionIDChange={() => {}}
        onActionConfirm={(action, context) => {
          pushPromptAction(action, context)
        }}
        title="Please select a character to swap with"
        breadcrumbs={<></>}
      />
    )
  }

  return null
}

export { PhaseMain }
