import { v4 } from 'uuid'
import { getTriggers } from './access'
import { withState } from './actor'
import { pushItems } from './queue'
import type { SAction, SActor, State, STrigger } from './state'
import type { Delta, DeltaContext } from './types/delta'

function pushAction(
  state: State,
  action: SAction,
  context: DeltaContext
): State {
  const actionQueue = pushItems(state.actionQueue, {
    ID: v4(),
    action,
    context,
  })
  return {
    ...state,
    actionQueue,
  }
}

function registerTrigger(
  state: State,
  context: DeltaContext,
  type: STrigger['type']
): State {
  const triggers = getTriggers(state).filter(
    (item) =>
      item.trigger.type === type && item.trigger.validate(state, context)
  )
  const triggerQueue = pushItems(state.triggerQueue, ...triggers)

  return {
    ...state,
    triggerQueue,
  }
}

function mutateActor(
  state: State,
  context: DeltaContext,
  delta: Delta<SActor>
): State {
  return {
    ...state,
    actors: state.actors.map((a) => {
      if (delta.filter && !delta.filter(a, context)) {
        return a
      }
      return delta.apply(a, context)
    }),
  }
}

function mutateDamage(
  state: State,
  context: DeltaContext,
  damage: number
): State {
  state = mutateActor(state, context, {
    filter: (a) => a.ID === context.targetIDs[0],
    apply: (a) => withState(a, { damage: a.state.damage + damage }),
  })
  if (damage > 0) {
    state = registerTrigger(state, context, 'onDamage')
  }
  return state
}

export { pushAction, registerTrigger, mutateActor, mutateDamage }
