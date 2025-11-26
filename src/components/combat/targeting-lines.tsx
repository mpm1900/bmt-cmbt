import { useGameState } from '@/hooks/useGameState'
import { useGameUI, type Point } from '@/hooks/useGameUI'
import { convertPositionToTargetContext, getActor } from '@/game/access'
import type { SActionItem, SActor, State } from '@/game/state'
import { usePlayerID } from '@/hooks/usePlayer'

function TargetinLine({
  sourceActor,
  sourcePosition,
  state,
  targetID,
}: {
  sourceActor: SActor
  sourcePosition: Point
  state: State
  targetID: string
}) {
  const playerID = usePlayerID()
  const actorPositions = useGameUI((s) => s.actorPositions)

  const targetPos = actorPositions[targetID]
  if (!targetPos) return null

  const targetActor = getActor(state, targetID)
  if (!targetActor) return null

  const sourceIsPlayer = sourceActor.playerID === playerID
  const targetIsPlayer = targetActor.playerID === playerID
  const startX = sourcePosition.x + sourcePosition.width / 2
  const startY = sourceIsPlayer
    ? sourcePosition.y - sourcePosition.height + 20
    : sourcePosition.y + sourcePosition.height * 2
  const endX = targetPos.x + targetPos.width / 2
  const endY = targetIsPlayer
    ? targetPos.y - targetPos.height + 20
    : targetPos.y + targetPos.height * 2

  const dx = endX - startX
  const dy = endY - startY
  const distance = Math.sqrt(dx * dx + dy * dy)
  const arcHeight = (distance / 3) * (targetIsPlayer ? -1 : 1)

  const sCurvePath = `M ${startX},${startY} C ${startX},${
    startY - arcHeight
  } ${endX},${endY + arcHeight} ${endX},${endY}`

  return (
    <g key={targetID}>
      <path
        d={sCurvePath}
        stroke={sourceIsPlayer ? 'var(--color-ally)' : 'var(--color-enemy)'}
        strokeWidth="2"
        fill="none"
        strokeDasharray="5, 5"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="1000"
          to="0"
          dur="15s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  )
}

export function TargetingLines({
  currentAction,
}: {
  currentAction: SActionItem
}) {
  const actorPositions = useGameUI((s) => s.actorPositions)
  const state = useGameState((s) => s.state)
  const context = convertPositionToTargetContext(state, currentAction.context)
  const sourcePos = actorPositions[context.sourceID]
  if (!sourcePos) return null

  const sourceActor = getActor(state, context.sourceID)
  if (!sourceActor) return null

  return (
    <svg className="absolute inset-0 pointer-events-none h-screen w-screen z-0">
      {context.targetIDs.map(
        (targetID) =>
          targetID && (
            <TargetinLine
              sourceActor={sourceActor}
              sourcePosition={sourcePos}
              state={state}
              targetID={targetID}
            />
          )
      )}
    </svg>
  )
}
