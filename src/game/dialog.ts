import { v4 } from 'uuid'
import { NavigateDialog } from './data/actions/_system/navigate-dialog'
import type { SActor, SDialogMessage, State } from './state'
import { newContext } from './mutations'
import type { StaticDialogOption } from './types/dialog'

function createStaticNavigationOption(
  option: Partial<StaticDialogOption<State, SActor>>,
  toID: string,
  messages: Array<SDialogMessage>
): StaticDialogOption<State, SActor> {
  return {
    ID: v4(),
    type: 'static',
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
