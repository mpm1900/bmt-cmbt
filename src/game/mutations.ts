import { v4 } from 'uuid'
import { getActor, getTriggers } from './access'
import { getDamageAmount, withDamage } from './actor'
import { pushItems } from './queue'
import type { SAction, SActor, State, STrigger } from './state'
import type { Delta, DeltaContext } from './types/delta'
import type { Damage } from './types/damage'
import { SwapIn } from './data/actions/swap'

function pushAction(
  state: State,
  context: DeltaContext,
  action: SAction
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

function pushPrompt(
  state: State,
  context: DeltaContext,
  prompt: SAction
): State {
  const promptQueue = pushItems(state.promptQueue, [
    {
      ID: v4(),
      action: prompt,
      context,
    },
  ])
  return {
    ...state,
    promptQueue,
  }
}

function resolvePrompt(state: State, context: DeltaContext): State {
  const prompt = state.promptQueue.active
  if (!prompt) return state
  const actionQueue = pushItems(state.actionQueue, [
    {
      ID: v4(),
      action: prompt.action,
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
  const targetID = context.targetIDs[0]
  state = mutateActor(state, context, {
    filter: (ac) => ac.ID === targetID,
    apply: (ac) => {
      const a = getActor(state, context.sourceID)
      const b = getActor(state, targetID)
      if (!a || !b) return ac
      const damageAmount = getDamageAmount(a, b, damage)
      committed += damageAmount
      return withDamage(ac, ac.state.damage + damageAmount)
    },
  })
  if (committed > 0) {
    state = registerTrigger(state, context, 'onDamage')
  }
  return state
}

function validateState(
  state: State,
  options: {
    minActiveActorCount: number
  }
): State {
  const teams = state.players.map((player) =>
    state.actors.filter((a) => a.playerID === player.ID && a.state.alive)
  )
  console.log('validating state')
  console.log(teams)
  teams.forEach((team) => {
    const active = team.filter((a) => a.state.active)
    const bench = team.filter((a) => !a.state.active)
    if (active.length < options.minActiveActorCount && bench.length > 0) {
      // select a random bench actor to be the source
      const source = bench[0]
      state = pushPrompt(state, { sourceID: source.ID, targetIDs: [] }, SwapIn)
    }
  })
  return state
}

export {
  pushAction,
  pushPrompt,
  resolvePrompt,
  registerTrigger,
  mutateActor,
  mutateDamage,
  validateState,
}
