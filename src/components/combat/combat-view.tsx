import { useGameState } from '@/hooks/useGameState'
import { PhaseStart } from './phase-start'
import { PhasePlanning } from './phase-planning'
import { PhaseMain } from './phase-main'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { ButtonGroup } from '../ui/button-group'
import { Button } from '../ui/button'
import { useGameUI } from '@/hooks/useGameUI'
import { PhaseEnd } from './phase-end'
import { ScrollArea } from '../ui/scroll-area'
import { PhasePre } from './phase-pre'
import { useEffect, useRef, useState } from 'react'

function CombatView() {
  const { state, next, nextPhase, deleteCombat } = useGameState(
    (store) => store
  )
  const { view, set } = useGameUI((s) => s)
  const combatLogRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState('debug')

  useEffect(() => {
    if (combatLogRef.current) {
      combatLogRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [state.combatLog.length, activeTab])

  if (!state.combat) return null
  if (view === 'dialog') return null
  const phase = state.combat.phase

  return (
    <div className="flex-1 flex items-center justify-center px-16">
      <div className="flex flex-1 gap-4 items-center justify-end max-w-252">
        <div>
          {phase === 'start' && <PhaseStart />}
          {phase === 'planning' && <PhasePlanning />}
          {phase === 'main' && <PhaseMain />}
          {phase === 'end' && <PhaseEnd />}
          {phase === 'pre' && <PhasePre />}
          {phase === 'post' && (
            <Card className="w-172">
              <CardHeader>
                <CardTitle>The battle is over</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => {
                    set({ view: 'dialog' })
                    deleteCombat()
                  }}
                >
                  continue
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="flex-1 max-w-80 h-108">
          <Card className="h-full">
            <Tabs defaultValue="debug" onValueChange={setActiveTab}>
              <CardHeader>
                <TabsList>
                  <TabsTrigger value="debug">Debug</TabsTrigger>
                  <TabsTrigger value="combat-log">Combat Log</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="w-full">
                <TabsContent value="debug">
                  <div>Actions: {state.actionQueue.length}</div>
                  <div>Prompts: {state.promptQueue.length}</div>
                  <div>Triggers: {state.triggerQueue.length}</div>
                  <div>Mutations: {state.mutationQueue.length}</div>
                  <ButtonGroup>
                    <Button variant="outline" onClick={next}>
                      Next
                    </Button>
                    <Button variant="outline" onClick={nextPhase}>
                      Next Phase
                    </Button>
                  </ButtonGroup>
                </TabsContent>
                <TabsContent value="combat-log">
                  <ScrollArea className="h-84">
                    <ul className="text-sm">
                      {state.combatLog.map((log, index) => (
                        <li key={index}>{log}</li>
                      ))}
                      <div ref={combatLogRef} />
                    </ul>
                  </ScrollArea>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}

export { CombatView }
