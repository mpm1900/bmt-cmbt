import { useGameState } from '@/hooks/useGameState'
import { useEffect } from 'react'

function DialogController() {
  const { state } = useGameState((s) => s)

  if (!state.combat) {
    return <DialogNextController />
  }
}

function DialogNextController() {
  const next = useGameState((s) => s.next)

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('next')
      next()
    }, 1000)

    return () => clearInterval(interval)
  }, [])
  return null
}

export { DialogController }
