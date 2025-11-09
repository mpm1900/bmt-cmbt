import { getNextType } from '@/game/next'
import type { CombatPhase } from '@/game/types/combat'
import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'
import { useEffect } from 'react'

function getTickRate(type: ReturnType<typeof getNextType>, phase: CombatPhase) {
  switch (type) {
    case 'action':
      return 1500
    case 'trigger': {
      if (phase === 'main') return 500
      return 100
    }
    default:
      return 100
  }
}

function useTickNext() {
  const next = useGameState((s) => s.next)
  const state = useGameState((s) => s.state)
  const nextType = getNextType(state)
  const view = state.combat!.phase

  useEffect(() => {
    const interval = setInterval(
      () => {
        next()
      },
      getTickRate(nextType, view)
    )

    return () => clearInterval(interval)
  }, [nextType, view])
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
