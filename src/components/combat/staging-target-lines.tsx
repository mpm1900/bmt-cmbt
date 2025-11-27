import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'
import { TargetingLines } from './targeting-lines'
import { convertPositionToTargetContext } from '@/game/access'

function StagingTargetLines() {
  const ui = useGameUI((s) => s)
  const state = useGameState((s) => s.state)
  const { actors, combat } = state
  if (!ui.activeContext) return null
  const context = convertPositionToTargetContext(state, ui.activeContext)
  const activeActor = actors.find((a) => a.ID === context.sourceID)
  const activeAction = activeActor?.actions.find(
    (ac) => ac.ID === ui.activeActionID
  )
  const targetIDSet = new Set(
    context.targetIDs.concat(ui.hoverActorID).filter((id) => !!id)
  )

  if (!combat || combat.phase !== 'planning' || !activeAction || !activeActor) {
    return null
  }

  return (
    <TargetingLines
      sourceRef={ui.activeActionRef}
      current={{
        ID: 'staging',
        action: activeAction,
        context: {
          ...context,
          targetIDs: Array.from(targetIDSet),
        },
      }}
    />
  )
}

export { StagingTargetLines }
