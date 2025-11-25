import { useGameState } from '@/hooks/useGameState'
import { useEffect } from 'react'
import { ViewLayoutContent } from '../view-layout'
import { DialogNode } from './dialog-node'
import { EncounterController } from './encounter-controller'
import { DialogCard } from './dialog-card'
import { CardAction, CardHeader, CardTitle } from '../ui/card'
import { hasNext } from '@/game/next'
import { AnimatePresence } from 'motion/react'
import { Button } from '../ui/button'

function EncounterView() {
  const { state } = useGameState((s) => s)
  const phase = state.combat?.phase
  const planning = phase === 'planning'
  const running = !planning && hasNext(state)
  const pastEncounters = Object.values(state.pastEncounters).filter(
    (e) => e.ID !== state.encounter.ID
  )
  useEffect(() => {}, [state])

  return (
    <>
      <EncounterController />
      <ViewLayoutContent>
        <AnimatePresence mode="wait" onExitComplete={() => {}}>
          <DialogCard key={state.encounter.ID}>
            <CardHeader className="flex items-start justify-between">
              <div className="h-10 -mt-6 -ml-8 relative">
                <div className="triangle border-t-yellow-950/50 absolute -bottom-4 left-0 z-0"></div>
                <CardTitle className="px-8 title text-2xl bg-yellow-950 border border-yellow-900/50 leading-10 relative text-shadow-xl shadow-xl z-10 ring ring-black">
                  {state.encounter.name}
                </CardTitle>
              </div>
              <CardAction>
                {pastEncounters.length > 0 && (
                  <Button variant="ghost" disabled={running}>
                    <span className="text-muted-foreground">Travel</span>
                  </Button>
                )}
              </CardAction>
            </CardHeader>
            <DialogNode />
          </DialogCard>
        </AnimatePresence>
      </ViewLayoutContent>
    </>
  )
}

export { EncounterView }
