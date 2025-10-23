import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'
import { useEffect } from 'react'

function PhaseController() {
  const phase = useGameState((s) => s.state.battle?.phase)
  const next = useGameState((s) => s.next)

  switch (phase) {
    case 'start':
      return <StartPhaseController next={next} />
    case 'planning':
      return <PlanningPhaseController />
    case 'main':
      return <MainPhaseController next={next} />
    case 'end':
    case 'pre':
      return <EndPhaseController next={next} />
    default:
      return null
  }
}

function StartPhaseController({ next }: { next: () => void }) {
  useEffect(() => {
    const interval = setInterval(() => {
      next()
    }, 100)

    return () => clearInterval(interval)
  }, [])
  return null
}

function PlanningPhaseController() {
  const state = useGameState((s) => s.state)
  const { resetActive } = useGameUI((s) => s)
  const count = state.actionQueue.map((i) => i.ID).length
  useEffect(() => {
    resetActive(state)
  }, [count])
  return null
}

function MainPhaseController({ next }: { next: () => void }) {
  useEffect(() => {
    const interval = setInterval(() => {
      next()
    }, 100)

    return () => clearInterval(interval)
  }, [])
  return null
}

function EndPhaseController({ next }: { next: () => void }) {
  useEffect(() => {
    const interval = setInterval(() => {
      next()
    }, 100)

    return () => clearInterval(interval)
  }, [])
  return null
}

export { PhaseController }
