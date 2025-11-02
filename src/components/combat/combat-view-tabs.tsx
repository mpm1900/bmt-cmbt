import { useGameState } from '@/hooks/useGameState'
import { TabsList, TabsTrigger } from '../ui/tabs'
import { usePlayerID } from '@/hooks/usePlayer'

function CombatViewTabs() {
  const playerID = usePlayerID()
  const player = useGameState((s) =>
    s.state.players.find((p) => p.ID === playerID)
  )
  return (
    <TabsList>
      <TabsTrigger value="actions">Actions</TabsTrigger>
      <TabsTrigger value="switch">Swap Actors</TabsTrigger>
      <TabsTrigger value="items" disabled={player!.items.length === 0}>
        Items
      </TabsTrigger>
    </TabsList>
  )
}

export { CombatViewTabs }
