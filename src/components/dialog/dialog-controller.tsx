import { hasNext } from '@/game/next'
import { useGameState } from '@/hooks/useGameState'
import { useEffect } from 'react'

function DialogController() {
  const { state } = useGameState((s) => s)

  if (!state.combat) {
    return <DialogNextController />
  }
}

function DialogNextController() {
  const state = useGameState((s) => s.state)
  const next = useGameState((s) => s.next)
  const run = hasNext(state)
  useEffect(() => {
    if (!run) return
    const interval = setInterval(() => {
      next()
    }, 0)

    return () => clearInterval(interval)
  }, [run])
  return null
}

export { DialogController }
