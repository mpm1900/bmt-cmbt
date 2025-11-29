import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'
import { convertPositionToTargetContext, getActor } from '@/game/access'
import type { SActionItem, SActor, State } from '@/game/state'
import { usePlayerID } from '@/hooks/usePlayer'
import { cn } from '@/lib/utils'

type Point = { x: number; y: number }
function Curve({
  start,
  end,
  source,
  target,
  ...props
}: Omit<React.ComponentProps<'path'>, 'end'> & {
  start: Point
  end: Point
  source: 'ally' | 'enemy'
  target: 'ally' | 'enemy'
}) {
  let curvePath: string
  const dx = end.x - start.x
  const dy = end.y - start.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  const areAllies = source === 'ally' && target === 'ally'
  let arcHeight = areAllies
    ? distance / 4
    : (distance / 3) * (target === 'ally' ? -1 : 1)

  if (distance === 0) return null

  if (areAllies) {
    const normalX = -dy / (distance / 2)
    const normalY = dx / (distance / 2)

    const cp1x = start.x + normalX * arcHeight
    const cp1y = start.y + normalY * arcHeight - 20
    const cp2x = end.x + normalX * arcHeight
    const cp2y = end.y + normalY * arcHeight

    curvePath = `M ${start.x},${start.y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${end.x},${end.y}`
  } else {
    curvePath = `M ${start.x},${start.y} C ${start.x},${
      start.y - arcHeight
    } ${end.x},${end.y + arcHeight} ${end.x},${end.y}`
  }

  return (
    <g>
      <path
        d={curvePath}
        strokeWidth="2"
        fill="none"
        strokeDasharray="5, 5"
        {...props}
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
  const targetRef = Object.values(playerRefs).find(
    (_, index) => index === targetPlayer.activeActorIDs.indexOf(targetID)
  )

  if (!targetRef || !targetRef.current || !sourceRef || !sourceRef.current) {
    console.log('missing ref', targetID, playerRefs)
    return null
  }

  const targetPos = targetRef.current.getBoundingClientRect()
  if (!targetPos) {
    console.log('no target position')
    return null
  }

  const targetActor = getActor(state, targetID)
  if (!targetActor) {
    console.log('no target actor')
    return null
  }

  const sourceIsPlayer = sourceActor.playerID === playerID
  const targetIsPlayer = targetActor.playerID === playerID
  const sourcePosition = sourceRef.current!.getBoundingClientRect()
  const startX = sourcePosition.x + sourcePosition.width / 2
  const startY = sourceIsPlayer
    ? sourcePosition.y + 4
    : sourcePosition.y + sourcePosition.height * 1
  const endX = targetPos.x + targetPos.width / 2
  const endY = targetIsPlayer
    ? targetPos.y + 8
    : targetPos.y + targetPos.height * 1 - 4

  return (
    <svg
      className={cn('absolute inset-0 pointer-events-none h-screen w-screen', {
        'z-10': sourceActor.playerID === targetActor.playerID,
      })}
    >
      <defs>
        <filter id="shadow">
          <feDropShadow
            dx="3"
            dy="3"
            stdDeviation="1"
            flood-color="black"
            flood-opacity="0.9"
          />
        </filter>
      </defs>
      <Curve
        start={{ x: startX, y: startY }}
        end={{ x: endX, y: endY }}
        stroke={sourceIsPlayer ? 'var(--color-ally)' : 'var(--color-enemy)'}
        source={sourceActor.playerID === playerID ? 'ally' : 'enemy'}
        target={targetActor.playerID === playerID ? 'ally' : 'enemy'}
        filter="url(#shadow)"
      />
    </svg>
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
    Object.values(playerRefs).find(
      (_, index) =>
        index === player.activeActorIDs.indexOf(current.context.sourceID)
    )
  if (!sourceRef) return null

  const sourceActor = getActor(state, context.sourceID)
  if (!sourceActor) return null

  return (
    <>
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
    </>
  )
}
