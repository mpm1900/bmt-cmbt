import { ActorCombobox } from '@/components/crew/actor-combobox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGameState } from '@/hooks/useGameState'
import { usePlayerID } from '@/hooks/usePlayer'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, UserPlus } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/crew')({
  component: RouteComponent,
})

function RouteComponent() {
  const playerID = usePlayerID()
  const state = useGameState((s) => s.state)
  const actors = state.actors.filter((a) => a.playerID === playerID)
  const [activeID, setActive] = useState(actors[0]?.ID)
  const active = actors.find((a) => a.ID === activeID)!
  return (
    <div className="h-screen w-screen flex flex-col items-center gap-6 p-6">
      <div className="w-220 flex justify-end">
        <Button asChild>
          <Link to="/">
            Begin <ArrowRight />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-3 grid-rows-2 w-220 gap-2 p-2 rounded-xs border ring ring-black bg-background/60">
        {actors.map((a) => (
          <ActorCombobox
            key={a.ID}
            value={a.name}
            active={a.ID === activeID}
            onSelect={() => setActive(a.ID)}
          />
        ))}
        {actors.length <= 5 && (
          <Button variant="outline">
            Add Party Member <UserPlus />
          </Button>
        )}
      </div>
      <Card className="w-220">
        <CardHeader>
          <CardTitle>{active.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Select>
            <SelectTrigger>
              class
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              pastime
              <SelectValue placeholder="Select Pastime" />
            </SelectTrigger>
          </Select>
          <Select>
            <SelectTrigger>
              weapon
              <SelectValue placeholder="Select Weapon" />
            </SelectTrigger>
          </Select>
        </CardContent>
      </Card>
    </div>
  )
}
