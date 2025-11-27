import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'
import { convertPositionToTargetContext, getActor } from '@/game/access'
import type { SActionItem, SActor, State } from '@/game/state'
import { usePlayerID } from '@/hooks/usePlayer'

function TargetinLine({
  sourceActor,
  sourceRef,
  state,
  targetID,
}: {
  sourceActor: SActor
  sourceRef: React.RefObject<HTMLElement>
  state: State
  targetID: string
}) {
  const playerID = usePlayerID()
  const target = state.actors.find((a) => a.ID === targetID)!
  const targetPlayer = state.players.find((p) => p.ID === target.playerID)!
  const activeRefs = useGameUI((s) => s.activeRefs)
  const playerRefs = activeRefs[targetPlayer.ID]
  const targetRef = playerRefs.find(
    (_, index) => index === targetPlayer.activeActorIDs.indexOf(targetID)
  )

  if (!targetRef || !targetRef.current || !sourceRef || !sourceRef.current)
    return null

  const targetPos = targetRef.current.getBoundingClientRect()
  if (!targetPos) return null

  const targetActor = getActor(state, targetID)
  if (!targetActor) return null

  const sourceIsPlayer = sourceActor.playerID === playerID
  const targetIsPlayer = targetActor.playerID === playerID
  const sourcePosition = sourceRef.current!.getBoundingClientRect()
  const startX = sourcePosition.x + sourcePosition.width / 2
  const startY = sourceIsPlayer
    ? sourcePosition.y + 20
    : sourcePosition.y + sourcePosition.height * 1
  const endX = targetPos.x + targetPos.width / 2
  const endY = targetIsPlayer
    ? targetPos.y + 20
    : targetPos.y + targetPos.height * 1

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
  current,
  sourceRef,
}: {
  current: SActionItem
  sourceRef?: React.RefObject<HTMLDivElement>
}) {
  const activeRefs = useGameUI((s) => s.activeRefs)
  const state = useGameState((s) => s.state)
  const player = state.players.find((p) => p.ID === current.context.playerID)!
  const playerRefs = activeRefs[current.context.playerID]

  const context = convertPositionToTargetContext(state, current.context)
  sourceRef =
    sourceRef ??
    playerRefs.find(
      (_, index) =>
        index === player.activeActorIDs.indexOf(current.context.sourceID)
    )
  if (!sourceRef) return null

  const sourceActor = getActor(state, context.sourceID)
  if (!sourceActor) return null

  return (
    <svg className="absolute inset-0 pointer-events-none h-screen w-screen z-0">
      {context.targetIDs.map(
        (targetID, index) =>
          targetID && (
            <TargetinLine
              key={context.sourceID + targetID + index}
              sourceActor={sourceActor}
              sourceRef={sourceRef}
              state={state}
              targetID={targetID}
            />
          )
      )}
    </svg>
  )
}
