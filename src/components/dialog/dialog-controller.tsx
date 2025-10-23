import { useGameState } from '@/hooks/useGameState'
import { useEffect } from 'react'

function DialogController() {
  const { state } = useGameState((s) => s)

  if (!state.combat && state.mutationQueue.length > 0) {
    return <DialogNextController />
  }
}

function DialogNextController() {
  const next = useGameState((s) => s.next)

  useEffect(() => {
    next()
  }, [])
  return null
}

export { DialogController }
