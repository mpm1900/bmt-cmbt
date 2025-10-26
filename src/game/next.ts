import { findActor, mapActor } from './access'
import {
  handleTrigger,
  newContext,
  pushAction,
  pushLogs,
  resolvePrompt,
  sortActionQueue,
  sortPromptQueue,
  startDialog,
  validateState,
  withPhase,
} from './mutations'
import { pop, push } from './queue'
import { resolveAction } from './resolvers'
import type { State, Combat } from './state'
import type { DeltaContext, DeltaQueueItem, DeltaResolver } from './types/delta'

function resolveTrigger(
  resolver: DeltaResolver<State, DeltaContext, DeltaContext>,
  state: State,
  context: DeltaContext
): DeltaQueueItem<State, DeltaContext>[] {
  if (!resolver.validate(state, context)) {
    console.error('resolver validation failed', resolver, state, context)
    return []
  }
  return resolver.resolve(state, context).flatMap((m) => m)
}

function nextAction(state: State): State {
  state = sortActionQueue(state)
  const item = state.actionQueue[0]
  state = pushLogs(state, [
    `${mapActor(state, item.context.sourceID, (a) => a.name)} uses ${item.action.name}.`,
  ])
  const mutations = resolveAction(state, item.context, item.action)
  const mutationQueue = push(state.mutationQueue, mutations)
  const actionQueue = pop(state.actionQueue)
  return {
    ...state,
    actionQueue,
    mutationQueue,
  }
}

function nextTrigger(state: State): State {
  if (!state.triggerQueue[0]) return state

  const mutations = resolveTrigger(
    state.triggerQueue[0].trigger,
    state,
    state.triggerQueue[0].context
  )
  const triggerQueue = pop(state.triggerQueue)
  const mutationQueue = push(state.mutationQueue, mutations)
  return {
    ...state,
    mutationQueue,
    triggerQueue,
  }
}

function nextMutation(state: State): State {
  if (!state.mutationQueue[0]) return state

  const { delta, context } = state.mutationQueue[0]
  if (delta.filter && !delta.filter(state, context)) return state
  state = state.mutationQueue[0].delta.apply(
    state,
    state.mutationQueue[0].context
  )
  const mutationQueue = pop(state.mutationQueue)
  return {
    ...state,
    mutationQueue,
  }
}

function nextPhase(phase: Combat['phase']): Combat['phase'] {
  switch (phase) {
    case 'pre':
      return 'start'
    case 'start':
      return 'planning'
    case 'planning':
      return 'main'
    case 'main':
      return 'end'
    case 'end':
      return 'start'
    default:
      return 'pre'
  }
}

function nextTurnPhase(state: State): State {
  if (!state.combat) return state
  const phase = nextPhase(state.combat.phase)
  state = withPhase(state, phase)

  if (phase === 'start') {
    state = handleTrigger(state, newContext({}), 'on-turn-start')
  }

  if (phase === 'planning') {
    const player = state.players.find(
      (p) => p.ID === state.dialog.activeNodeID
    )!
    player.activeActorIDs.forEach((id) => {
      if (!id) return

      const aiActions = findActor(state, id)?.actions.filter((a) => a.ai) ?? []
      const context = newContext({ playerID: player.ID, sourceID: id })
      const ratedActions = aiActions.map((a) => {
        const contexts = a
          .ai!.generateContexts(state, context, a)
          .map((c) => [c, a.ai!.compute(state, c)] as const)
          .sort((a, b) => b[1] - a[1])

        return [a, contexts[0][0], contexts[0][1]] as const
      })
      if (ratedActions[0]) {
        state = pushAction(state, ratedActions[0][1], ratedActions[0][0])
      }
    })
  }

  if (phase === 'end') {
    state = handleTrigger(state, newContext({}), 'on-turn-end')
  }

  return state
}

function nextAiPrompt(state: State): State {
  state = sortPromptQueue(state)
  if (!state.promptQueue[0]) return state

  const { action, context } = state.promptQueue[0]
  if (context.playerID !== state.dialog.activeNodeID || !action.ai) return state
  const contexts = action.ai
    .generateContexts(state, context, action)
    .map((c) => [c, action.ai!.compute(state, c)] as const)
    .sort((a, b) => b[1] - a[1])

  state = resolvePrompt(state, contexts[0][0])
  return state
}

function next(state: State): State {
  if (state.triggerQueue.length > 0) {
    return nextTrigger(state)
  }
  if (state.mutationQueue.length > 0) {
    return nextMutation(state)
  }

  if (state.combat) {
    if (state.promptQueue.length > 0) {
      return nextAiPrompt(state)
    }

    const valid = validateState(state)
    state = valid[0]

    // if there was a valication response, wait again
    if (!valid[1]) return state

    if (state.actionQueue.length > 0) {
      return nextAction(state)
    }

    return nextTurnPhase(state)
  }

  if (!state.dialog.activeNodeID) {
    state = startDialog(state)
  }

  return state
}

function hasNext(state: State): boolean {
  return (
    state.dialog.activeNodeID === undefined ||
    state.mutationQueue.length > 0 ||
    state.triggerQueue.length > 0 ||
    (state.actionQueue.length > 0 && state.promptQueue.length === 0) ||
    state.promptQueue[0]?.context.playerID === state.dialog.activeNodeID
  )
}

function getStatus(state: State): 'pending' | 'running' | 'idle' {
  if (state.combat?.phase === 'planning') {
    return 'pending'
  }
  if (hasNext(state)) {
    return 'running'
  }
  if (state.promptQueue.length > 0) {
    return 'pending'
  }

  return 'idle'
}

function flush(state: State): State {
  while (hasNext(state)) {
    state = next(state)
  }
  return state
}

export {
  resolveAction,
  nextAction,
  nextTrigger,
  nextMutation,
  nextTurnPhase,
  next,
  hasNext,
  getStatus,
  flush,
}
