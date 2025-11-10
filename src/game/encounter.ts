import { v4 } from 'uuid'
import {
  NavigateDialog,
  NavigateSourceDialog,
} from './data/actions/_system/navigate-dialog'
import { newContext } from './mutations'
import type { SDialogOption, State } from './state'
import type { Message } from './types/message'
import type { DeltaContext } from './types/delta'

function newMessage(partial: Partial<Message>): Message {
  return {
    ID: v4(),
    context: newContext({}),
    text: null,
    depth: 0,
    ...partial,
  }
}

function createDialogOption(
  option: Partial<SDialogOption>,
  context: DeltaContext,
  nodeID: string,
  messages: Array<Message>
): SDialogOption {
  return {
    ID: v4(),
    disable: 'disable',
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

function createSourceDialogOption(
  option: Partial<SDialogOption>,
  context: DeltaContext,
  nodeID: string,
  messages: Array<Message>
): SDialogOption {
  return {
    ID: v4(),
    disable: 'disable',
    text: null,
    icons: null,
    context,
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

/*
function updateDialogOption(
  dialog: SDialog,
  nodeID: string,
  optionID: string,
  fn: (option: SDialogOption) => SDialogOption
): SDialog {
  return {
    ...dialog,
    nodes: dialog.nodes.map((node) =>
      node.ID === nodeID
        ? {
            ...node,
            options: node.options.map((option) =>
              option.ID === optionID ? fn(option) : option
            ),
          }
        : node
    ),
  }
}
*/

export {
  createDialogOption,
  createSourceDialogOption,
  newMessage,
  validateSingleTargetDialogOption,
  withContext,
}
