import { v4 } from 'uuid'
import { getActor, getTriggers, mapActor } from './access'
import { getDamageAmount, withDamage } from './actor'
import { push, sort } from './queue'
import type { SAction, SActor, State, STrigger } from './state'
import type { Delta, DeltaContext, DeltaPositionContext } from './types/delta'
import type { Damage } from './types/damage'
import { Swap } from './data/actions/swap'
import type { Player } from './types/player'

function newContext(context: Partial<DeltaContext>): DeltaPositionContext {
  return {
    playerID: '',
    sourceID: '',
    targetIDs: [],
    positions: [],
    ...context,
  }
}

function pushAction(
  state: State,
  context: DeltaPositionContext,
  action: SAction
): State {
  const actionQueue = push(state.actionQueue, [
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
  context: DeltaPositionContext,
  prompt: SAction
): State {
  const promptQueue = push(state.promptQueue, [
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

function resolvePrompt(state: State, context: DeltaPositionContext): State {
  if (!state.promptQueue[0]) return state
  const actionQueue = push(state.actionQueue, [
    {
      ID: v4(),
      action: state.promptQueue[0].action,
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
  const triggerQueue = push(state.triggerQueue, items)

  return {
    ...state,
    triggerQueue,
  }
}

function sortActionQueue(state: State): State {
  const actionQueue = sort(state.actionQueue, (a, b) => {
    const aSpe =
      mapActor(state, a.context.sourceID, (ac) => ac.stats.speed) ?? 0
    const bSpe =
      mapActor(state, b.context.sourceID, (ac) => ac.stats.speed) ?? 0
    return bSpe - aSpe
  })
  return {
    ...state,
    actionQueue,
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
      if (!a.state.alive || (delta.filter && !delta.filter(a, context))) {
        return a
      }
      return delta.apply(a, context)
    }),
  }
}

function mutatePlayer(
  state: State,
  context: DeltaContext,
  delta: Delta<Player>
): State {
  return {
    ...state,
    players: state.players.map((p) => {
      if (delta.filter && !delta.filter(p, context)) {
        return p
      }
      return delta.apply(p, context)
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
    filter: (ac) => context.targetIDs.includes(ac.ID),
    apply: (ac) => {
      const a = getActor(state, context.sourceID)
      const b = getActor(state, ac.ID)
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

function validateState(state: State): [State, boolean] {
  let valid = true
  state.players.forEach((player) => {
    const inactiveActors = state.actors.filter(
      (a) => a.playerID === player.ID && !player.activeActorIDs.includes(a.ID)
    )
    if (
      player.activeActorIDs.some((id) => id === null) &&
      inactiveActors.length > 0
    ) {
      state = pushPrompt(
        state,
        newContext({
          playerID: player.ID,
          sourceID: inactiveActors[0]?.ID,
        }),
        Swap
      )
      valid = false
    }
  })

  return [state, valid]
}

export {
  newContext,
  pushAction,
  pushPrompt,
  resolvePrompt,
  registerTrigger,
  sortActionQueue,
  mutateActor,
  mutatePlayer,
  mutateDamage,
  validateState,
}
