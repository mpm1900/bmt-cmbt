import { useGameState } from '@/hooks/useGameState'
import { PhaseStart } from './phase-start'
import { PhasePlanning } from './phase-planning'
import { PhaseMain } from './phase-main'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { ButtonGroup } from '../ui/button-group'
import { Button } from '../ui/button'
import { useGameUI } from '@/hooks/useGameUI'

function BattleView() {
  const { state, next, nextPhase } = useGameState((store) => store)
  const { view } = useGameUI((s) => s)
  if (!state.battle) return null
  if (view === 'dialog') return null

  return (
    <div className="flex-1 flex items-center justify-center px-16">
      <div className="flex flex-1 gap-4 justify-end max-w-252">
        {state.battle.phase === 'start' && <PhaseStart />}
        {state.battle.phase === 'planning' && <PhasePlanning />}
        {state.battle.phase === 'main' && <PhaseMain />}
        <Card className="flex-1 max-w-80">
          <Tabs defaultValue="debug">
            <CardHeader>
              <TabsList>
                <TabsTrigger value="debug">Debug</TabsTrigger>
                <TabsTrigger value="combat-log">Combat Log</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="w-full">
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
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

export { BattleView }
