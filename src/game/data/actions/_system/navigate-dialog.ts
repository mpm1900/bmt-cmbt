import type { SDialogAction } from '@/game/state'
import { InlineMutation } from './inline-mutation'
import { navigateDialogResolver, pushMessagesResolver } from '@/game/resolvers'
import { getAliveActiveActors } from '@/game/access'
import type { Message } from '@/game/types/message'

function NavigateDialog(
  nodeID: string,
  messages: Array<Message>
): SDialogAction {
  return InlineMutation((_state, context) => {
    return [
      pushMessagesResolver(
        context,
        messages.map((m) => ({ ...m, context }))
      ),
      navigateDialogResolver(nodeID, context),
    ]
  })
}

function NavigateSourceDialog(
  nodeID: string,
  messages: Array<Message>
): SDialogAction {
  const { targets, ...base } = NavigateDialog(nodeID, messages)
  return {
    ...base,
    validate: (state, context) =>
      getAliveActiveActors(state, context).length > 0,
    targets: {
      ...targets,
      validate: (_state, context) => !!context.sourceID,
    },
    sources: (state, context) => getAliveActiveActors(state, context),
  }
}

export { NavigateDialog, NavigateSourceDialog }
