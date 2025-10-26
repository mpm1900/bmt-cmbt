import { v4 } from 'uuid'
import {
  NavigateDialog,
  NavigateSourceDialog,
} from './data/actions/_system/navigate-dialog'
import type { SActor, SDialogMessage, SDialogOption, State } from './state'
import { newContext } from './mutations'
import {
  type DialogOptionContext,
  type DialogOptionContextMeta,
  type NoTargetDialogOption,
  type SingleTargetDialogOption,
} from './types/dialog'

function newMessage(partial: Partial<SDialogMessage>): SDialogMessage {
  return {
    ID: v4(),
    actorID: '',
    text: '',
    ...partial,
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
    context: newContext({ playerID: '__player__' }),
    action: NavigateDialog(
      toID,
      messages.concat([
        newMessage({
          text: option.text,
        }),
      ])
    ),
    ...option,
  }
}

function createSourceNavigationOption(
  option: Partial<SingleTargetDialogOption<State, SActor>>,
  nodeID: string,
  messages: Array<SDialogMessage>
): SingleTargetDialogOption<State, SActor> {
  const {
    context = newContext<DialogOptionContextMeta>({
      playerID: '__player__',
      text: '',
      ID: '',
    }),
  } = option
  return {
    ID: v4(),
    type: 'single-target',
    text: null,
    icons: null,
    context: context as DialogOptionContext,
    action: NavigateSourceDialog(
      nodeID,
      messages.concat([
        newMessage({
          text: option.text,
        }),
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
    option.action.targets.get(state, option.context).length > 0 &&
    option.context.targetIDs.length === 0
  ) {
    console.error('should have targets in context')
    return false
  }
  if (
    option.action.sources(state, option.context).length > 0 &&
    option.context.sourceID === ''
  ) {
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
  createSourceNavigationOption,
  validateSingleTargetDialogOption,
  withContext,
}
