import { v4 } from 'uuid'
import { NavigateDialog } from './data/actions/_system/navigate-dialog'
import type { SActor, SDialogMessage, State } from './state'
import { newContext } from './mutations'
import type { NoTargetDialogOption } from './types/dialog'

function createStaticNavigationOption(
  option: Partial<NoTargetDialogOption<State, SActor>>,
  toID: string,
  messages: Array<SDialogMessage>
): NoTargetDialogOption<State, SActor> {
  return {
    ID: v4(),
    type: 'no-target',
    text: null,
    icons: null,
    context: newContext({}),
    action: NavigateDialog(
      toID,
      messages.concat([
        {
          ID: v4(),
          actorID: '',
          text: option.text,
        },
      ])
    ),
    ...option,
  }
}

export { createStaticNavigationOption }
