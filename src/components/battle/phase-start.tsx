import { useGameState } from '@/hooks/useGameState'
import { ActionSelectionCard } from './action-selection-card'
import { getActor } from '@/game/access'

function PhaseStart() {
  const { state, resolvePrompt } = useGameState((s) => s)
  if (state.promptQueue[0]) {
    const action = state.promptQueue[0].action
    const context = state.promptQueue[0].context
    const source = getActor(state, context.sourceID)
    return (
      <ActionSelectionCard
        key={state.promptQueue[0].ID}
        playerID={context.playerID}
        source={source}
        actions={[action]}
        activeActionID={action.ID}
        onActiveActionIDChange={() => {}}
        onActionConfirm={(_action, context) => {
          resolvePrompt(context)
        }}
        title="Select a character to activate"
        breadcrumbs={<></>}
      />
    )
  }

  return null
}

export { PhaseStart }
