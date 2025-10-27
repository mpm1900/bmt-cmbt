import { v4 } from 'uuid'
import {
  NavigateDialog,
  NavigateSourceDialog,
} from './data/actions/_system/navigate-dialog'
import type { SActor, SDialogMessage, SDialogOption, State } from './state'
import { newContext } from './mutations'
import { type DialogOption } from './types/dialog'
import type { DeltaPositionContext } from './types/delta'
import { playerStore } from '@/hooks/usePlayer'

function newMessage(partial: Partial<SDialogMessage>): SDialogMessage {
  return {
    ID: v4(),
    actorID: '',
    text: '',
    ...partial,
  }
}

function createStaticNavigationOption(
  option: Partial<DialogOption<State, SActor>>,
  context: DeltaPositionContext,
  nodeID: string,
  messages: Array<SDialogMessage>
): DialogOption<State, SActor> {
  return {
    ID: v4(),
    text: null,
    icons: null,
    context,
    action: NavigateDialog(
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

function createSourceNavigationOption(
  option: Partial<SDialogOption>,
  nodeID: string,
  messages: Array<SDialogMessage>
): SDialogOption {
  const {
    context = newContext({
      playerID: playerStore.getState().playerID,
    }),
  } = option
  return {
    ID: v4(),
    text: null,
    icons: null,
    context: context,
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
  option: SDialogOption
): boolean {
  if (!option.action.targets.validate(state, option.context)) {
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
  option: SDialogOption,
  context: SDialogOption['context']
): SDialogOption {
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
