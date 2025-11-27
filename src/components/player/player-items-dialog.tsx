import { newContext } from '@/game/mutations'
import { useGameState } from '@/hooks/useGameState'
import { usePlayerID } from '@/hooks/usePlayer'
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { ItemsTable } from '../encounter/items-table'
import { MiniDropdown } from '../mini-dropdown'
import { ActorSelect } from '../encounter/actor-select'

function PlayerItemsDialog({
  onOpenChange,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const state = useGameState((s) => s.state)
  const resolveActionItem = useGameState((s) => s.resolveActionItem)
  const playerID = usePlayerID()
  const player = state.players.find((p) => p.ID === playerID)
  const context = newContext({ playerID })
  if (!player) return null

  return (
    <DialogContent className="w-180 !max-w-180">
      <DialogHeader>
        <DialogTitle>Items</DialogTitle>
      </DialogHeader>
      <ItemsTable
        items={player.items}
        actionHeader={<>Equip/Use</>}
        actions={(item) => (
          <>
            {item.use && <MiniDropdown>Use</MiniDropdown>}
            {item.consumable && !state.combat && (
              <ActorSelect
                disabled={false}
                placeholder="Use"
                options={item.consumable.targets
                  .get(state, context)
                  .map((t) => t.target)}
                value={undefined}
                onValueChange={(value) => {
                  onOpenChange?.(false)
                  resolveActionItem(item.consumable!, {
                    ...context,
                    sourceID: value,
                    targetIDs: [value],
                  })
                }}
              />
            )}
            {item.actions && <MiniDropdown>Equip</MiniDropdown>}
          </>
        )}
      />
    </DialogContent>
  )
}

export { PlayerItemsDialog }
