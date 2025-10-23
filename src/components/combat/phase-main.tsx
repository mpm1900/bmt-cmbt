import { useGameState } from '@/hooks/useGameState'
import { ActionSelectionCard } from './action-selection-card'
import { getActor } from '@/game/access'
import { usePrevious } from '@uidotdev/usehooks'

function PhaseMain() {
  const { state, resolvePrompt } = useGameState((s) => s)
  const prev = usePrevious(state.actionQueue[0])
  const aitem = prev ?? state.actionQueue[0]
  if (state.promptQueue[0]) {
    const action = state.promptQueue[0].action
    const context = state.promptQueue[0].context
    const source = getActor(state, context.sourceID)
    // TODO: Action cannot change
    return (
      <ActionSelectionCard
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

  if (aitem) {
    const { action, context } = aitem
    const source = getActor(state, context.sourceID)
    return (
      <div className="w-172">
        <div className="text-center">{source?.name} uses</div>
        <h1 className="text-6xl font-bold text-center">{action.name}</h1>
      </div>
    )
  }

  return null
}

export { PhaseMain }
