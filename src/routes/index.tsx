import { CombatView } from '@/components/combat/combat-view'
import { EncounterView } from '@/components/encounter/encounter-view'
import { EncounterActors } from '@/components/player/encounter-actors'
import { Player } from '@/components/player/player'
import { ViewHeader } from '@/components/view-header'
import { useGameCurrentAction, useGameState } from '@/hooks/useGameState'
import { usePlayerID } from '@/hooks/usePlayer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const players = useGameState((s) => s.state.players)
  const combat = useGameState((s) => s.state.combat)
  const current = useGameCurrentAction()
  const playerID = usePlayerID()
  const player = players.find((p) => p.ID === playerID)!
  const ai = players.find((p) => p.ID !== playerID)

  return (
    <div className="h-screen w-screen flex flex-col items-between bg-cover bg-no-repeat overflow-hidden">
      <ViewHeader />
      {ai && <EncounterActors encounter={ai} current={current} />}

      {combat && <CombatView current={current} />}
      {!combat && <EncounterView />}

      <Player player={player} current={current} />
    </div>
  )
}
