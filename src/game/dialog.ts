import { v4 } from 'uuid'
import { NavigateDialog } from './data/actions/_system/navigate-dialog'
import type { SActor, SDialogMessage, SDialogOption, State } from './state'
import { newContext } from './mutations'
import type {
  NoTargetDialogOption,
  SingleTargetDialogOption,
} from './types/dialog'

function newMessage(text: string): SDialogMessage {
  return {
    ID: v4(),
    actorID: '',
    text,
  }
}

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

function validateSingleTargetDialogOption(
  state: State,
  option: SingleTargetDialogOption<State, SActor>
): boolean {
  if (!option.action.targets.validate(state, option.context)) {
    console.log('action validation failed', option.action, option.context)
    return false
  }
  if (
    option.targetOptions.length > 0 &&
    option.context.targetIDs.length === 0
  ) {
    console.error('should have targets in context')
    return false
  }
  if (option.sourceOptions.length > 0 && option.context.sourceID === '') {
    console.error('should have source in context')
    return false
  }

  return true
}

function withContext(
  option: SingleTargetDialogOption<State, SActor>,
  context: SDialogOption['context']
): SingleTargetDialogOption<State, SActor> {
  return {
    ...option,
    context: {
      ...option.context,
      ...context,
    },
  }
}

export {
  newMessage,
  createStaticNavigationOption,
  validateSingleTargetDialogOption,
  withContext,
}
