import { useGameState } from '@/hooks/useGameState'
import { ActionSelectionCard } from './action-selection-card'
import { getActor } from '@/game/access'

function PhaseMain() {
  const { state, pushPromptAction } = useGameState((s) => s)
  console.log(state)
  if (state.promptQueue[0]) {
    const action = state.promptQueue[0].action
    console.log('context', state.promptQueue[0].context)
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
        title="Please select a character to swap with"
        breadcrumbs={<></>}
      />
    )
  }

  return null
}

export { PhaseMain }
