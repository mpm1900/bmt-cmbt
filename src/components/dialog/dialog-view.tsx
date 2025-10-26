import { useGameState } from '@/hooks/useGameState'
import { useEffect } from 'react'
import { ViewLayoutContent } from '../view-layout'
import { useGameUI } from '@/hooks/useGameUI'
import { DialogCard } from './dialog-card'
import { DialogItemsCard } from './dialog-items-card'

function DialogView() {
  const { state } = useGameState((s) => s)
  const view = useGameUI((s) => s.view)
  useEffect(() => {
    // console.log(state)
  }, [state])
  return (
    <ViewLayoutContent>
      {view === 'dialog' && <DialogCard />}
      {view === 'items' && <DialogItemsCard />}
    </ViewLayoutContent>
  )
}

export { DialogView }
