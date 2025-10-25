import type { SAction, SDialogMessage } from '@/game/state'
import { InlineMutation } from './inline-mutation'
import { navigateDialogResolver, pushMessagesResolver } from '@/game/resolvers'
import { getAliveActiveActors } from '@/game/access'

function NavigateDialog(
  nodeID: string,
  messages: Array<SDialogMessage>
): SAction {
  return InlineMutation((_state, context) => [
    pushMessagesResolver(context, messages),
    navigateDialogResolver(nodeID),
  ])
}

function NavigateSourceDialog(
  nodeID: string,
  messages: Array<SDialogMessage>
): SAction {
  const { targets, ...base } = NavigateDialog(nodeID, messages)
  return {
    ...base,
    validate: (state, context) =>
      getAliveActiveActors(state, context).length > 0,
    targets: {
      ...targets,
      validate: (_state, context) => !!context.sourceID,
    },
  }
}

export { NavigateDialog, NavigateSourceDialog }
