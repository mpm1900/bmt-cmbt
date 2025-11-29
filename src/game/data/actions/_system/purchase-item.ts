import { getEncounterState, getItem } from '@/game/access'
import { newMessage } from '@/game/encounter'
import { purchaseItemResolver, pushMessagesResolver } from '@/game/resolvers'
import type { SDialogAction } from '@/game/state'
import { v4 } from 'uuid'
import { Item } from '../../messages'

function PurchaseItem(itemID: string): SDialogAction {
  return {
    ID: v4(),
    name: 'Purchase Item',
    priority: 0,
    cooldown: () => 0,
    validate: (state, context) => {
      const estate = getEncounterState(state)
      const player = state.players.find((p) => p.ID === context.playerID)
      const item = getItem(state, estate.activeNodeID!, itemID)
      if (!player || !item) return false
      return player.credits > item.value
    },
    targets: {
      unique: true,
      max: () => 0,
      get: () => [],
      validate: () => true,
    },
    sources: () => [],
    resolve: (state, context) => {
      const estate = getEncounterState(state)
      return [
        purchaseItemResolver(context, itemID),
        pushMessagesResolver(context, [
          newMessage({
            text: Item(
              getItem(state, estate.activeNodeID!, itemID),
              ` purchased.`
            ),
          }),
        ]),
      ]
    },
  }
}

export { PurchaseItem }
