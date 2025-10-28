import { CombatView } from '@/components/combat/combat-view'
import { DialogView } from '@/components/dialog/dialog-view'
import { EncounterActors } from '@/components/player/encounter-actors'
import { Player } from '@/components/player/player'
import { ViewHeader } from '@/components/view-header'
import { useGameState } from '@/hooks/useGameState'
import { usePlayerID } from '@/hooks/usePlayer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const state = useGameState((s) => s.state)
  const playerID = usePlayerID()
  const player = state.players.find((p) => p.ID === playerID)!
  const ai = state.players.find((p) => p.ID !== playerID)

  return (
    <div className="h-screen w-screen flex flex-col items-between bg-cover bg-no-repeat">
      <ViewHeader />
      {ai && <EncounterActors encounter={ai} />}

      {state.combat && <CombatView />}
      {!state.combat && <DialogView />}

      <Player player={player} />
    </div>
  )
}
