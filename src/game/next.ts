import { mapActor } from './access'
import { popItem, pushItems, sort } from './queue'
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
  const actionQueue = popItem(state.actionQueue)
  state = {
    ...state,
    actionQueue,
  }
  if (!actionQueue.active) return state

  const mutations = resolve(
    actionQueue.active.action,
    state,
    actionQueue.active.context
  )
  const mutationQueue = pushItems(state.mutationQueue, mutations)
  return {
    ...state,
    mutationQueue,
  }
}

function nextTrigger(state: State): State {
  const triggerQueue = popItem(state.triggerQueue)
  state = {
    ...state,
    triggerQueue,
  }
  if (!triggerQueue.active) return state

  const mutations = resolve(
    triggerQueue.active.trigger,
    state,
    triggerQueue.active.context
  )
  const mutationQueue = pushItems(state.mutationQueue, mutations)
  return {
    ...state,
    mutationQueue,
  }
}

function nextMutation(state: State): State {
  state = {
    ...state,
    mutationQueue: popItem(state.mutationQueue),
  }
  if (!state.mutationQueue.active) return state

  const { delta, context } = state.mutationQueue.active
  if (delta.filter && !delta.filter(state, context)) return state
  return state.mutationQueue.active.delta.apply(
    state,
    state.mutationQueue.active.context
  )
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
        return aSpe - bSpe
      }),
    }
  }

  return state
}

function next(state: State): State {
  if (state.triggerQueue.queue.length > 0) {
    return nextTrigger(state)
  }
  if (state.mutationQueue.queue.length > 0) {
    return nextMutation(state)
  }
  if (state.actionQueue.queue.length > 0) {
    return nextAction(state)
  }

  return nextTurnPhase(state)
}

function hasNext(state: State): boolean {
  return (
    state.mutationQueue.queue.length > 0 ||
    state.triggerQueue.queue.length > 0 ||
    state.actionQueue.queue.length > 0
  )
}

function flush(state: State): State {
  while (hasNext(state)) {
    state = next(state)
  }
  return state
}

export {
  nextAction,
  nextTrigger,
  nextMutation,
  nextTurnPhase,
  next,
  hasNext,
  flush,
}
