import { useGameState } from '@/hooks/useGameState'
import { ActionSelectionCard } from './action-selection-card'
import { findActor, getActiveActorIDs, getActor } from '@/game/access'
import { CardHeader, CardTitle } from '../ui/card'
import type { SActionItem } from '@/game/state'

function PhaseMain({ current }: { current: SActionItem | undefined }) {
  const { state, resolvePrompt } = useGameState((s) => s)
  const prompt = state.promptQueue[0]

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

  if (current) {
    const { action, context } = current
    const source = findActor(state, context.sourceID)
    const targets = context.targetIDs
      .map((id) => findActor(state, id))
      .filter(Boolean)
    const positions = context.positions
      .map((p) =>
        findActor(
          state,
          getActiveActorIDs(state, p.playerID)[p.index] ?? undefined
        )
      )
      .filter(Boolean)
    const names = new Set(
      targets.map((t) => t?.name).concat(positions.map((p) => p?.name))
    )
    return (
      <div className="w-172 text-center self-center justify-self-center m-auto">
        <div className="text-center">{source?.name} uses</div>
        <h1 className="text-6xl font-black text-center">{action.name}</h1>
        <div>{Array.from(names).join(', ')}</div>
      </div>
    )
  }

  return null
}

export { PhaseMain }
