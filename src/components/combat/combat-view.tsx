import { useGameState } from '@/hooks/useGameState'
import { PhaseStart } from './phase-start'
import { PhasePlanning } from './phase-planning'
import { PhaseMain } from './phase-main'
import { Card, CardAction, CardContent, CardHeader } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { useGameUI } from '@/hooks/useGameUI'
import { PhaseEnd } from './phase-end'
import { PhasePre } from './phase-pre'
import { useState } from 'react'
import { ViewLayout } from '../view-layout'
import { PhasePost } from './phase-post'
import { CombatLog } from './combat-log'
import { CombatDebug } from './combat-debug'
import { PhaseController } from './phase-controller'
import { Button } from '../ui/button'
import { SkipForward } from 'lucide-react'
import { findActor, nextAvailableAction } from '@/game/access'

function CombatView() {
  const state = useGameState((store) => store.state)
  const phase = state.combat!.phase
  const next = useGameState((store) => store.nextPhase)
  const { set, activeActorID } = useGameUI((s) => s)
  const [activeTab, setActiveTab] = useState('debug')
  const activeActor = findActor(state, activeActorID)

  if (!phase) return null

  return (
    <>
      <PhaseController />
      <ViewLayout
        main={
          <Tabs
            defaultValue="actions"
            onValueChange={() => {
              set({
                activeActionID: nextAvailableAction(activeActor, state)?.ID,
              })
            }}
          >
            {phase === 'start' && <PhaseStart />}
            {phase === 'planning' && <PhasePlanning />}
            {phase === 'main' && <PhaseMain />}
            {phase === 'end' && <PhaseEnd />}
            {phase === 'pre' && <PhasePre />}
            {phase === 'post' && <PhasePost />}
          </Tabs>
        }
        aside={
          <Card className="h-120">
            <Tabs defaultValue="combat-log" onValueChange={setActiveTab}>
              <CardHeader>
                <TabsList>
                  <TabsTrigger value="debug">Debug</TabsTrigger>
                  <TabsTrigger value="combat-log">Combat Log</TabsTrigger>
                </TabsList>
                <CardAction>
                  <Button variant="secondary" onClick={next}>
                    <SkipForward />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="w-full">
                <TabsContent value="debug">
                  <CombatDebug />
                </TabsContent>
                <TabsContent value="combat-log">
                  <CombatLog activeTab={activeTab} />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        }
      />
    </>
  )
}

export { CombatView }
