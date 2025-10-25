import type { SAction, SDialogMessage } from '@/game/state'
import { InlineMutation } from './inline-mutation'
import { navigateDialogResolver, pushMessagesResolver } from '@/game/resolvers'

function NavigateDialog(
  nodeID: string,
  messages: Array<SDialogMessage>
): SAction {
  return InlineMutation((_state, context) => [
    pushMessagesResolver(context, messages),
    navigateDialogResolver(nodeID),
  ])
}

export { NavigateDialog }
