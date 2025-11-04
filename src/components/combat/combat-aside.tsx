import { SkipForward } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardAction, CardContent, CardHeader } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { CombatDebug } from './combat-debug'
import { CombatLog } from './combat-log'
import { useGameState } from '@/hooks/useGameState'

function CombatAside() {
  const next = useGameState((store) => store.nextPhase)

  return (
    <Card className="max-h-120 w-80">
      <Tabs defaultValue="combat-log">
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
            <CombatLog />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}

export { CombatAside }
