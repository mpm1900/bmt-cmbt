import type { SAction, SDialogMessage } from '@/game/state'
import { InlineMutation } from './inline-mutation'
import { navigateDialogResolver } from '@/game/resolvers'

function NavigateDialog(
  nodeID: string,
  messages: Array<SDialogMessage>
): SAction {
  return InlineMutation((_state, _context) => [
    navigateDialogResolver(nodeID, messages),
  ])
}

export { NavigateDialog }
