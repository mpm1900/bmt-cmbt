import { useGameState } from '@/hooks/useGameState'
import { PhaseStart } from './phase-start'
import { PhasePlanning } from './phase-planning'
import { PhaseMain } from './phase-main'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { ButtonGroup } from '../ui/button-group'
import { Button } from '../ui/button'
import { useGameUI } from '@/hooks/useGameUI'
import { PhaseEnd } from './phase-end'
import { ScrollArea } from '../ui/scroll-area'

function BattleView() {
  const { state, next, nextPhase } = useGameState((store) => store)
  const { view } = useGameUI((s) => s)
  if (!state.battle) return null
  if (view === 'dialog') return null

  return (
    <div className="flex-1 flex items-center justify-center px-16">
      <div className="flex flex-1 gap-4 items-center justify-end max-w-252">
        <div>
          {state.battle.phase === 'start' && <PhaseStart />}
          {state.battle.phase === 'planning' && <PhasePlanning />}
          {state.battle.phase === 'main' && <PhaseMain />}
          {state.battle.phase === 'end' && <PhaseEnd />}
          {state.battle.phase === 'pre' && <PhaseEnd />}
        </div>
        <div className="flex-1 max-w-80 h-108">
          <Card className="h-full">
            <Tabs defaultValue="debug">
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

export { BattleView }
