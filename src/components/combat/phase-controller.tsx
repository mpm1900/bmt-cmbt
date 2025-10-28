import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'
import { useEffect } from 'react'

function useTickNext() {
  const next = useGameState((s) => s.next)

  useEffect(() => {
    const interval = setInterval(() => {
      next()
    }, 100)

    return () => clearInterval(interval)
  }, [])
}

function PhaseController() {
  const phase = useGameState((s) => s.state.combat?.phase)

  switch (phase) {
    case 'start':
      return <StartPhaseController />
    case 'planning':
      return <PlanningPhaseController />
    case 'main':
      return <MainPhaseController />
    case 'end':
    case 'pre':
      return <EndPhaseController />
    default:
      return null
  }
}

function StartPhaseController() {
  useTickNext()

  return null
}

function PlanningPhaseController() {
  const state = useGameState((s) => s.state)
  const resetActive = useGameUI((s) => s.resetActive)
  const count = state.actionQueue.map((i) => i.ID).length

  useEffect(() => {
    resetActive(state)
  }, [count])

  return null
}

function MainPhaseController() {
  useTickNext()

  return null
}

function EndPhaseController() {
  useTickNext()

  return null
}

export { PhaseController }
