import { mapActor } from './access'
import { validateState } from './mutations'
import { pop, push, sort } from './queue'
import type { State, Turn } from './state'
import type { DeltaContext, DeltaQueueItem, DeltaResolver } from './types/delta'

function resolve(
  resolver: DeltaResolver<State>,
  state: State,
  context: DeltaContext
): DeltaQueueItem<State>[] {
  if (!resolver.validate(state, context)) {
    console.error('resolver validation failed', resolver, state, context)
    return []
  }
  return resolver.resolve(state, context).flatMap((m) => m)
}

function nextAction(state: State): State {
  if (!state.actionQueue[0]) return state

  const mutations = resolve(
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

  const mutations = resolve(
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

function nextPhase(phase: Turn['phase']): Turn['phase'] {
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
  state = {
    ...state,
    turn: {
      ...state.turn,
      phase: nextPhase(state.turn.phase),
    },
  }

  if (state.turn.phase === 'main') {
    state = {
      ...state,
      actionQueue: sort(state.actionQueue, (a, b) => {
        const aSpe =
          mapActor(state, a.context.sourceID, (ac) => ac.stats.speed) ?? 0
        const bSpe =
          mapActor(state, b.context.sourceID, (ac) => ac.stats.speed) ?? 0
        return bSpe - aSpe
      }),
    }
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
  if (state.promptQueue[0]) {
    return state
  }

  let result = validateState(state, { minActiveActorCount: 3 })
  state = result[0]
  const valid = result[1]
  if (!valid) return state

  if (state.actionQueue.length > 0) {
    return nextAction(state)
  }

  return nextTurnPhase(state)
}

function hasNext(state: State): boolean {
  return (
    state.mutationQueue.length > 0 ||
    state.triggerQueue.length > 0 ||
    (state.actionQueue.length > 0 && state.promptQueue.length === 0)
  )
}

function getStatus(state: State): string {
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
  resolve,
  nextAction,
  nextTrigger,
  nextMutation,
  nextTurnPhase,
  next,
  hasNext,
  getStatus,
  flush,
}
