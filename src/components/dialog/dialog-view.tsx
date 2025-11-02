import { useGameState } from '@/hooks/useGameState'
import { useEffect } from 'react'
import { ViewLayoutContent } from '../view-layout'
import { useGameUI } from '@/hooks/useGameUI'
import { DialogNode } from './dialog-node'
import { DialogItemsCard } from './dialog-items-card'
import { DialogController } from './dialog-controller'
import { DialogCard } from './dialog-card'
import { CardAction, CardHeader } from '../ui/card'
import { Box, MessageSquare } from 'lucide-react'
import { hasNext } from '@/game/next'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'

function DialogView() {
  const { state } = useGameState((s) => s)
  const { set, view } = useGameUI((s) => s)
  const phase = state.combat?.phase
  const planning = phase === 'planning'
  const running = !planning && hasNext(state)

  useEffect(() => {
    // console.log(state)
  }, [state])

  return (
    <>
      <DialogController />
      <ViewLayoutContent>
        <DialogCard>
          <Tabs
            className="flex-1"
            value={view}
            onValueChange={(v) => set({ view: v as typeof view })}
          >
            <CardHeader>
              <CardAction>
                <TabsList>
                  <TabsTrigger value="dialog" disabled={running}>
                    Dialog
                    <MessageSquare />
                  </TabsTrigger>
                  <TabsTrigger value="items">
                    Items
                    <Box />
                  </TabsTrigger>
                </TabsList>
              </CardAction>
            </CardHeader>
            {view === 'dialog' && <DialogNode />}
            {view === 'items' && <DialogItemsCard />}
          </Tabs>
        </DialogCard>
      </ViewLayoutContent>
    </>
  )
}

export { DialogView }
