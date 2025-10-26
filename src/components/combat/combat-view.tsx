import { useGameState } from '@/hooks/useGameState'
import { PhaseStart } from './phase-start'
import { PhasePlanning } from './phase-planning'
import { PhaseMain } from './phase-main'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { useGameUI } from '@/hooks/useGameUI'
import { PhaseEnd } from './phase-end'
import { PhasePre } from './phase-pre'
import { useEffect, useState } from 'react'
import { ViewLayout } from '../view-layout'
import { PhasePost } from './phase-post'
import { CombatLog } from './combat-log'
import { CombatDebug } from './combat-debug'

function CombatView() {
  const phase = useGameState((store) => store.state.combat?.phase)
  const { view, set } = useGameUI((s) => s)
  const [activeTab, setActiveTab] = useState('debug')

  useEffect(() => {
    set({ view: 'actions' })
  }, [])

  if (!phase) return null
  if (view === 'dialog') return null

  return (
    <ViewLayout
      main={
        <div>
          {phase === 'start' && <PhaseStart />}
          {phase === 'planning' && <PhasePlanning />}
          {phase === 'main' && <PhaseMain />}
          {phase === 'end' && <PhaseEnd />}
          {phase === 'pre' && <PhasePre />}
          {phase === 'post' && <PhasePost />}
        </div>
      }
      aside={
        <Card className="h-108">
          <Tabs defaultValue="combat-log" onValueChange={setActiveTab}>
            <CardHeader>
              <TabsList>
                <TabsTrigger value="debug">Debug</TabsTrigger>
                <TabsTrigger value="combat-log">Combat Log</TabsTrigger>
              </TabsList>
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
  )
}

export { CombatView }
