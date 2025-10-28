import { pushMessagesResolver } from '@/game/resolvers'
import type { SDialogAction, State } from '@/game/state'
import type { DeltaContext } from '@/game/types/delta'
import type { Message } from '@/game/types/message'

function withMessageLogs(
  action: SDialogAction,
  logFn: (state: State, context: DeltaContext) => Array<Message>
): SDialogAction {
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
