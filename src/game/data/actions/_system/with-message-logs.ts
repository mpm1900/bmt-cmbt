import { pushMessagesResolver } from '@/game/resolvers'
import type { SDialogAction, State } from '@/game/state'
import type { DeltaContext } from '@/game/types/delta'
import type { DialogMessage } from '@/game/types/dialog'

function withMessageLogs(
  action: SDialogAction,
  logFn: (state: State, context: DeltaContext) => Array<DialogMessage>
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
