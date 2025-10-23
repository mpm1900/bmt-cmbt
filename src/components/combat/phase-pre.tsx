import { useGameState } from '@/hooks/useGameState'
import { ActionSelectionCard } from './action-selection-card'
import { getActor } from '@/game/access'
import { useGameUI } from '@/hooks/useGameUI'

function PhasePre() {
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
        title="Combat Initiated"
        breadcrumbs={<></>}
      />
    )
  }

  return null
}

export { PhasePre }
