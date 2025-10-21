import { v4 } from 'uuid'
import { findActor, getActor, getTriggers, isActive, mapActor } from './access'
import { getDamageResult, withDamage } from './actor'
import { enqueue, pop, push, sort } from './queue'
import type {
  SAction,
  SActor,
  SEffect,
  SEffectItem,
  State,
  STrigger,
} from './state'
import type { Delta, DeltaContext, DeltaPositionContext } from './types/delta'
import type { Damage } from './types/damage'
import { SwapWith } from './data/actions/swap'
import type { Player } from './types/player'
import { resolveAction } from './next'

function newContext(context: Partial<DeltaContext>): DeltaPositionContext {
  return {
    playerID: '',
    sourceID: '',
    targetIDs: [],
    positions: [],
    ...context,
  }
}

function decrementEffect(effect: SEffect): SEffect {
  return {
    ...effect,
    duration: effect.duration === undefined ? undefined : effect.duration - 1,
  }
}

function decrementEffectItem(effectItem: SEffectItem): SEffectItem {
  return {
    ...effectItem,
    effect: decrementEffect(effectItem.effect),
  }
}

function pushLogs(
  state: State,
  logs: Array<State['combatLog'][number]>
): State {
  return {
    ...state,
    combatLog: [...state.combatLog, ...logs],
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
  const mutations = resolveAction(state.promptQueue[0].action, state, context)
  const mutationQueue = push(state.mutationQueue, mutations)
  const promptQueue = pop(state.promptQueue)
  return {
    ...state,
    promptQueue,
    mutationQueue,
  }
}

function handleTrigger(
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
  const triggerQueue = enqueue(state.triggerQueue, items)

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

function filterActionQueue(state: State, sourceID: string): State {
  const actionQueue = state.actionQueue.filter(
    (action) => action.context.sourceID !== sourceID
  )

  console.log('filtering action queue', sourceID)
  console.log(state.actionQueue)
  console.log(actionQueue)

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
      const damageAmount = getDamageResult(a, b, damage)
      committed += damageAmount
      return withDamage(ac, ac.state.damage + damageAmount)
    },
  })

  const targetID = context.targetIDs[0] // this line could be problematic, but probs not
  const target = findActor(state, targetID)
  const dead = isActive(state, targetID) && !target?.state.alive

  if (committed > 0) {
    state = handleTrigger(state, context, 'onDamage')
    state = pushLogs(state, [`${target?.name} took ${committed} damage.`])
  }

  if (dead) {
    state = handleTrigger(state, context, 'onDeath')
  }

  return state
}

function validateState(state: State): [State, boolean] {
  let valid = true
  state.players.forEach((player) => {
    const inactiveActors = state.actors.filter(
      (a) =>
        a.playerID === player.ID &&
        !player.activeActorIDs.includes(a.ID) &&
        a.state.alive
    )
    if (
      player.activeActorIDs.some((id) => id === null) &&
      inactiveActors.length > 0
    ) {
      const count = Math.min(
        inactiveActors.length,
        player.activeActorIDs.filter((a) => a === null).length
      )
      state = pushPrompt(
        state,
        newContext({
          playerID: player.ID,
        }),
        SwapWith(count)
      )
      valid = false
    }
  })

  return [state, valid]
}

export {
  newContext,
  decrementEffect,
  decrementEffectItem,
  pushLogs,
  pushAction,
  pushPrompt,
  resolvePrompt,
  handleTrigger,
  sortActionQueue,
  filterActionQueue,
  mutateActor,
  mutatePlayer,
  mutateDamage,
  validateState,
}
