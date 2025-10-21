import { convertPositionToTargetContext } from './access'
import {
  handleTrigger,
  newContext,
  sortActionQueue,
  validateState,
} from './mutations'
import { pop, push } from './queue'
import type { State, Battle } from './state'
import type {
  DeltaContext,
  DeltaPositionContext,
  DeltaQueueItem,
  DeltaResolver,
} from './types/delta'

function resolveAction(
  resolver: DeltaResolver<State, DeltaPositionContext, DeltaContext>,
  state: State,
  context: DeltaPositionContext
): DeltaQueueItem<State, DeltaContext>[] {
  if (!resolver.validate(state, context)) {
    console.error('resolver validation failed', resolver, state, context)
    return []
  }
  const resolverContext = convertPositionToTargetContext(state, context)
  console.log('resolving action', context, resolverContext, state)
  return resolver.resolve(state, resolverContext).flatMap((m) => m)
}

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
  const mutations = resolveAction(
    state.actionQueue[0].action,
    state,
    state.actionQueue[0].context
  )
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

function nextPhase(phase: Battle['phase']): Battle['phase'] {
  switch (phase) {
    case 'start':
      return 'planning'
    case 'planning':
      return 'main'
    case 'main':
      return 'end'
    case 'end':
      return 'start'
    default:
      return 'start'
  }
}

function nextTurnPhase(state: State): State {
  if (!state.battle) return state
  const phase = nextPhase(state.battle.phase)

  state = {
    ...state,
    battle: {
      ...state.battle,
      phase,
    },
  }

  if (phase === 'start') {
    state = handleTrigger(state, newContext({}), 'onTurnStart')
  }

  if (phase === 'end') {
    state = handleTrigger(state, newContext({}), 'onTurnEnd')
  }

  return state
}

function next(state: State): State {
  if (state.triggerQueue.length > 0) {
    return nextTrigger(state)
  }
  if (state.mutationQueue.length > 0) {
    return nextMutation(state)
  }
  if (state.promptQueue.length > 0) {
    return state // pause, wait for input
  }
  // before each action pop, run the validations
  const valid = validateState(state)
  state = valid[0]

  // if there was a valication response, wait again
  if (!valid[1]) return state

  if (state.actionQueue.length > 0) {
    return nextAction(state)
  }

  if (state.battle) {
    return nextTurnPhase(state)
  }

  return state
}

function hasNext(state: State): boolean {
  return (
    state.mutationQueue.length > 0 ||
    state.triggerQueue.length > 0 ||
    (state.actionQueue.length > 0 && state.promptQueue.length === 0)
  )
}

function getStatus(state: State): string {
  if (state.battle?.phase === 'planning') {
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
