import { hasNext } from '@/game/next'
import { useGameState } from '@/hooks/useGameState'
import { useEffect } from 'react'

function EncounterController() {
  const { state } = useGameState((s) => s)

  if (!state.combat) {
    return <EncounterNextController />
  }
}

function EncounterNextController() {
  const state = useGameState((s) => s.state)
  const next = useGameState((s) => s.next)
  const run = hasNext(state)
  useEffect(() => {
    if (!run) return
    const interval = setInterval(() => {
      next()
    }, 100)

    return () => clearInterval(interval)
  }, [run])
  return null
}

export { EncounterController }
