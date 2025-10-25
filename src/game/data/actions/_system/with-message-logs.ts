import { pushMessagesResolver } from '@/game/resolvers'
import type { SAction, State } from '@/game/state'
import type { DeltaContext } from '@/game/types/delta'
import type { DialogMessage } from '@/game/types/dialog'

function withMessageLogs(
  action: SAction,
  logFn: (state: State, context: DeltaContext) => Array<DialogMessage>
): SAction {
  return {
    ...action,
    resolve: (state, context) => {
      return [
        pushMessagesResolver(context, logFn(state, context)),
        ...action.resolve(state, context),
      ]
    },
  }
}

export { withMessageLogs }
