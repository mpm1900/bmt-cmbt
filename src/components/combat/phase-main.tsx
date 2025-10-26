import { useGameState } from '@/hooks/useGameState'
import { ActionSelectionCard } from './action-selection-card'
import { getActor } from '@/game/access'
import { usePrevious } from '@uidotdev/usehooks'
import { CardHeader, CardTitle } from '../ui/card'

function PhaseMain() {
  const { state, resolvePrompt } = useGameState((s) => s)
  const action = state.actionQueue[0]
  const prompt = state.promptQueue[0]
  const prev = usePrevious(action)
  const aitem = prev ?? action

  if (prompt) {
    const action = prompt.action
    const context = prompt.context
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
      >
        <CardHeader>
          <CardTitle>Select Character(s)</CardTitle>
        </CardHeader>
      </ActionSelectionCard>
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
