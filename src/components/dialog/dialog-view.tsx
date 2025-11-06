import { useGameState } from '@/hooks/useGameState'
import { useEffect } from 'react'
import { ViewLayoutContent } from '../view-layout'
import { DialogNode } from './dialog-node'
import { DialogItemsCard } from './dialog-items-card'
import { DialogController } from './dialog-controller'
import { DialogCard } from './dialog-card'
import { CardHeader, CardTitle } from '../ui/card'
import { hasNext } from '@/game/next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

function DialogView() {
  const { state } = useGameState((s) => s)
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
          <Tabs className="flex-1" defaultValue="dialog">
            <CardHeader className="flex items-center">
              <TabsList>
                <TabsTrigger value="dialog" disabled={running}>
                  Dialog
                </TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
              </TabsList>
              <CardTitle>{state.encounter.name}</CardTitle>
            </CardHeader>
            <TabsContent value="dialog" className="flex flex-1">
              <DialogNode />
            </TabsContent>
            <TabsContent value="items" className="flex flex-1">
              <DialogItemsCard />
            </TabsContent>
          </Tabs>
        </DialogCard>
      </ViewLayoutContent>
    </>
  )
}

export { DialogView }
