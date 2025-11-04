import { getItem } from '@/game/access'
import { newMessage } from '@/game/dialog'
import { purchaseItemResolver, pushMessagesResolver } from '@/game/resolvers'
import type { SDialogAction } from '@/game/state'
import { v4 } from 'uuid'

function PurchaseItem(itemID: string): SDialogAction {
  return {
    ID: v4(),
    name: 'Purchase Item',
    priority: 0,
    validate: (state, context) => {
      const player = state.players.find((p) => p.ID === context.playerID)
      const item = getItem(state, state.dialog.activeNodeID!, itemID)
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
      return [
        purchaseItemResolver(context, itemID),
        pushMessagesResolver(context, [
          newMessage({
            text:
              getItem(state, state.dialog.activeNodeID!, itemID)?.name +
              ' purchased.',
          }),
        ]),
      ]
    },
  }
}

export { PurchaseItem }
