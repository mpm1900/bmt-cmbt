import { useGameState } from '@/hooks/useGameState'
import { useEffect } from 'react'
import { ViewLayoutContent } from '../view-layout'
import { DialogNode } from './dialog-node'
import { DialogItemsCard } from './dialog-items-card'
import { EncounterController } from './encounter-controller'
import { DialogCard } from './dialog-card'
import { CardAction, CardHeader, CardTitle } from '../ui/card'
import { hasNext } from '@/game/next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { AnimatePresence } from 'motion/react'
import { Button } from '../ui/button'

function EncounterView() {
  const { state } = useGameState((s) => s)
  const phase = state.combat?.phase
  const planning = phase === 'planning'
  const running = !planning && hasNext(state)
  const pastEncounters = Object.values(state.pastEncounters)
  useEffect(() => {}, [state])

  return (
    <>
      <EncounterController />
      <ViewLayoutContent>
        <AnimatePresence mode="wait" onExitComplete={() => {}}>
          <DialogCard key={state.encounter.ID}>
            <Tabs className="flex-1" defaultValue="dialog">
              <CardHeader className="flex items-center">
                <TabsList>
                  <TabsTrigger value="dialog" disabled={running}>
                    Dialog
                  </TabsTrigger>
                  <TabsTrigger value="items">Items</TabsTrigger>
                </TabsList>
                <CardTitle className="flex-1 px-2">
                  {state.encounter.name}
                </CardTitle>
                <CardAction>
                  {pastEncounters.length > 0 && (
                    <Button variant="ghost">
                      <span className="text-muted-foreground">Travel</span>
                    </Button>
                  )}
                </CardAction>
              </CardHeader>
              <TabsContent value="dialog" className="flex flex-1">
                <DialogNode />
              </TabsContent>
              <TabsContent value="items" className="flex flex-1">
                <DialogItemsCard />
              </TabsContent>
            </Tabs>
          </DialogCard>
        </AnimatePresence>
      </ViewLayoutContent>
    </>
  )
}

export { EncounterView }
