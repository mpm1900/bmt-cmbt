import { useGameState } from '@/hooks/useGameState'
import { ActionSelectionCard } from './action-selection-card'
import { getActor } from '@/game/access'
import { useGameUI } from '@/hooks/useGameUI'

function PhaseStart() {
  const { state, resolvePrompt } = useGameState((s) => s)
  const { playerID } = useGameUI((s) => s)
  if (
    state.promptQueue[0] &&
    state.promptQueue[0].context.playerID === playerID
  ) {
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
        title="Select character(s) to activate"
        breadcrumbs={<></>}
      />
    )
  }

  return null
}

export { PhaseStart }
