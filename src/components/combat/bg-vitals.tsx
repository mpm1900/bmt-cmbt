import { getActor } from '@/game/access'
import { getHealth } from '@/game/lib/actor'
import { type State, type SPlayer } from '@/game/state'
import { useGameState } from '@/hooks/useGameState'
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from 'motion/react'
import { useEffect, useMemo } from 'react'

function VitalLine({ actorID }: { actorID: string | null }) {
  const state = useGameState((s) => s.state)
  const actor = actorID ? getActor(state, actorID) : undefined

  const phase = useMotionValue(0)
  const hpPct = useMemo(() => {
    if (!actor) return 0
    const [cur, max] = getHealth<State, typeof actor>(actor)
    return Math.max(0, Math.min(1, cur / max))
  }, [actor?.state.damage, actor?.stats.health])

  const offset = useMemo(() => Math.random() * 32, [hpPct])

  useEffect(() => {
    const baseDur = 8
    const dur = Math.max(4, baseDur * hpPct + Math.random() * 3)
    const controls = animate(phase, [0, Math.PI * 2], {
      duration: dur,
      ease: 'linear',
      repeat: Infinity,
    })
    return () => controls.stop()
  }, [hpPct])

  const d = useTransform(phase, (p) => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200
    const height = 280
    const midY = height / 2
    const maxAmp = midY * 0.9

    const amplitude = maxAmp * Math.pow(hpPct, 1)
    const freq = 2 + 6 * hpPct

    const samples = Math.max(200, Math.floor(width / 6))
    let path = ''
    for (let i = 0; i <= samples; i++) {
      const x = (i / samples) * width
      const y =
        midY + amplitude * Math.sin((x / width) * Math.PI * 2 * freq + p)
      path += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    }
    return path
  })

  return (
    <motion.svg
      className="absolute top-1/3 h-[280px] w-full pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: Math.max(0.2, 1 - hpPct) }}
      exit={{ opacity: 0 }}
      style={{ left: offset }}
      aria-hidden
    >
      <defs>
        <linearGradient
          id={`vital-grad-${actorID}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
          <stop
            offset="15%"
            stopColor={`rgba(${Math.round(255 * (1 - hpPct))}, ${Math.round(255 * hpPct)}, ${Math.round(180 * hpPct)}, 0.6)`}
          />
          <stop
            offset="85%"
            stopColor={`rgba(${Math.round(255 * (1 - hpPct))}, ${Math.round(255 * hpPct)}, ${Math.round(180 * hpPct)}, 0.6)`}
          />
          <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
        </linearGradient>
        <filter
          id={`vital-glow-${actorID}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="20" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <motion.path
        d={d}
        stroke={`url(#vital-grad-${actorID})`}
        strokeWidth={3}
        fill="none"
        filter={`url(#vital-glow-${actorID})`}
      />
    </motion.svg>
  )
}

function BgVitals({ player }: { player: SPlayer }) {
  const activeIDs = player.activeActorIDs
  const state = useGameState((s) => s.state)
  console.log(activeIDs)

  return (
    <AnimatePresence mode="wait">
      {!state.combat && (
        <motion.div
          key={state.encounter.ID}
          className="absolute z-0 inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {activeIDs.map((id, i) => (
            <VitalLine key={(id ?? '') + i} actorID={id} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { BgVitals }
