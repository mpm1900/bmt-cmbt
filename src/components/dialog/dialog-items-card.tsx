import { useGameState } from '@/hooks/useGameState'
import { CardContent } from '../ui/card'
import { usePlayerID } from '@/hooks/usePlayer'
import { ItemsTable } from './items-table'
import { MiniDropdown } from '../mini-dropdown'
import { ActorSelect } from './actor-select'
import { newContext } from '@/game/mutations'

function DialogItemsCard() {
  const state = useGameState((s) => s.state)
  const playerID = usePlayerID()
  const player = state.players.find((p) => p.ID === playerID)
  const context = newContext({ playerID })

  if (!player) return null
  return (
    <>
      <CardContent className="flex-1">
        <ItemsTable
          items={player.items}
          actions={(item) => (
            <>
              {item.use && <MiniDropdown>Use</MiniDropdown>}
              {item.consumable && (
                <div>
                  <ActorSelect
                    disabled={false}
                    placeholder="Use"
                    options={item.consumable.targets
                      .get(state, context)
                      .map((t) => t.target)}
                    value={undefined}
                    onValueChange={() => {}}
                  />
                </div>
              )}
              {item.actions && <MiniDropdown>Equip</MiniDropdown>}
            </>
          )}
        />
      </CardContent>
    </>
  )
}

export { DialogItemsCard }
