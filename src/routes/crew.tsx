import { ActorCombobox } from '@/components/crew/actor-combobox'
import { useGameState } from '@/hooks/useGameState'
import { usePlayerID } from '@/hooks/usePlayer'
import { createFileRoute } from '@tanstack/react-router'
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
    <div className="h-screen w-screen flex flex-col items-center bg-cover bg-no-repeat">
      <div className="grid grid-cols-3 grid-rows-2 w-220 gap-2 m-12 p-2 rounded-lg bg-background/60">
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
