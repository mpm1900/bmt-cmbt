import { ActorCombobox } from '@/components/crew/actor-combobox'
import { Button } from '@/components/ui/button'
import { useGameState } from '@/hooks/useGameState'
import { usePlayerID } from '@/hooks/usePlayer'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/crew')({
  component: RouteComponent,
})

function RouteComponent() {
  const playerID = usePlayerID()
  const state = useGameState((s) => s.state)
  const actors = state.actors.filter((a) => a.playerID === playerID)
  const [active, setActive] = useState(actors[0]?.ID)
  return (
    <div className="h-screen w-screen flex flex-col gap-6 p-6 items-center bg-cover bg-no-repeat">
      <div className="w-220 flex justify-end">
        <Button asChild>
          <Link to="/">
            Begin <ArrowRight />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-3 grid-rows-2 w-220 gap-2 p-2 rounded-lg bg-background/60">
        {actors.map((a) => (
          <ActorCombobox
            key={a.ID}
            value={a.name}
            active={a.ID === active}
            onSelect={() => setActive(a.ID)}
          />
        ))}
      </div>
    </div>
  )
}
