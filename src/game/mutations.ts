import { v4 } from 'uuid'
import { getTriggers, mapActor } from './access'
import { withDamage, withState } from './actor'
import { pushItems } from './queue'
import type { SAction, SActor, State, STrigger } from './state'
import type { Delta, DeltaContext } from './types/delta'
import type { Damage } from './types/damage'

function pushAction(
  state: State,
  action: SAction,
  context: DeltaContext
): State {
  const actionQueue = pushItems(state.actionQueue, [
    {
      ID: v4(),
      action,
      context,
    },
  ])
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
    (trigger) => trigger.type === type && trigger.validate(state, context)
  )
  const items = triggers.map((trigger) => ({
    ID: v4(),
    trigger,
    context,
  }))
  const triggerQueue = pushItems(state.triggerQueue, items)

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
  damage: Damage
): State {
  let committed = 0
  state = mutateActor(state, context, {
    filter: (ac) => ac.ID === context.targetIDs[0],
    apply: (ac) => {
      const a = mapActor(state, context.sourceID, (ac) => ac)
      const b = mapActor(state, context.targetIDs[0], (ac) => ac)
      if (!a || !b) return ac
      const damageAmount = withDamage(a, b, damage)
      committed += damageAmount
      return withState(ac, { damage: ac.state.damage + damageAmount })
    },
  })
  if (committed > 0) {
    state = registerTrigger(state, context, 'onDamage')
  }
  return state
}

export { pushAction, registerTrigger, mutateActor, mutateDamage }
