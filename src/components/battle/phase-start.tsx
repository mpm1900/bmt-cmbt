import { useGameState } from '@/hooks/useGameState'
import { ActionSelectionCard } from './action-selection-card'
import { getActor } from '@/game/access'

function PhaseStart() {
  const { state, pushPromptAction } = useGameState((s) => s)
  if (state.promptQueue[0]) {
    const action = state.promptQueue[0].action
    const source = getActor(state, state.promptQueue[0].context.sourceID)
    return (
      <ActionSelectionCard
        source={source}
        actions={[action]}
        activeActionID={action.ID}
        onActiveActionIDChange={() => {}}
        onActionConfirm={(action, context) => {
          pushPromptAction(action, context)
        }}
        title="Please select a character to activate"
        breadcrumbs={<></>}
      />
    )
  }

  return null
}

export { PhaseStart }
