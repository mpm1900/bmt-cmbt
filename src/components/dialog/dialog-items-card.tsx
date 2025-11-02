import { useGameState } from '@/hooks/useGameState'
import { CardContent } from '../ui/card'
import { usePlayerID } from '@/hooks/usePlayer'
import { ItemsTable } from './items-table'
import { MiniDropdown } from '../mini-dropdown'

function DialogItemsCard() {
  const state = useGameState((s) => s.state)
  const playerID = usePlayerID()
  const player = state.players.find((p) => p.ID === playerID)

  if (!player) return null
  return (
    <>
      <CardContent className="flex-1">
        <ItemsTable
          items={player.items}
          actions={(item) => (
            <>
              <MiniDropdown>Use</MiniDropdown>
              {item.actions && <MiniDropdown>Equip</MiniDropdown>}
            </>
          )}
        />
      </CardContent>
    </>
  )
}

export { DialogItemsCard }
