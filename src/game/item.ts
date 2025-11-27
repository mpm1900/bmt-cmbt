import { newContext } from './mutations'
import type { SAction, SItem } from './state'

function toConsumable(
  action: SAction,
  options: {
    playerID: string
    itemID: string
  }
): SAction {
  return {
    ...action,
    resolve: (state, context) => {
      const result = action.resolve(state, context)
      return result.concat({
        ID: 'remove',
        context: newContext({ playerID: options.playerID }),
        delta: {
          apply: (s, c) => ({
            ...s,
            players: s.players.map((p) =>
              p.ID === c.playerID
                ? {
                    ...p,
                    items: p.items.filter((i) => i.ID !== options.itemID),
                  }
                : p
            ),
          }),
        },
      })
    },
  }
}

function withConsumable(
  item: SItem,
  options: {
    playerID: string
  }
): SItem {
  return {
    ...item,
    consumable: item.consumable
      ? toConsumable(item.consumable, {
          ...options,
          itemID: item.ID,
        })
      : undefined,
  }
}

export { withConsumable }
