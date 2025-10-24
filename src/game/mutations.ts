import { v4 } from 'uuid'
import {
  findActor,
  getActor,
  getAliveInactiveActors,
  getTriggers,
  isActive,
  mapActor,
} from './access'
import { getDamageResult, withDamage } from './actor'
import { enqueue, pop, push, sort } from './queue'
import type {
  Combat,
  SAction,
  SActor,
  SDialogOption,
  SEffect,
  SEffectItem,
  State,
  STrigger,
} from './state'
import type { Delta, DeltaContext, DeltaPositionContext } from './types/delta'
import type { Damage } from './types/damage'
import { SwapWith } from './data/actions/_system/swap'
import type { Player } from './types/player'
import { resolveAction } from './resolvers'
import { nextTurnPhase } from './next'

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

function addActionToQueue(
  state: State,
  context: DeltaPositionContext,
  action: SAction
): State {
  const existing = state.actionQueue.find(
    (i) => i.context.sourceID === context.sourceID
  )
  if (!!existing) {
    return state
  }

  state = pushAction(state, context, action)
  const maxLength = state.players.reduce(
    (len, player) => len + player.activeActorIDs.filter(Boolean).length,
    0
  )

  if (state.actionQueue.length === maxLength) {
    state = nextTurnPhase(state)
  }

  return state
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
  const mutations = resolveAction(state, context, state.promptQueue[0].action)
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
      const source = getActor(state, context.sourceID)
      const target = getActor(state, ac.ID)
      if (!source || !target) return ac
      const damageAmount = getDamageResult(source, target, damage)
      committed += damageAmount
      const newDamage = ac.state.damage + damageAmount
      return withDamage(ac, newDamage, newDamage < target.stats.health ? 1 : 0)
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

function withPhase(state: State, phase: Combat['phase']): State {
  if (!state.combat) return state
  return {
    ...state,
    combat: {
      ...state.combat,
      phase,
    },
  }
}

function validateState(state: State): [State, boolean] {
  let valid = true
  state.players.forEach((player) => {
    const inactiveLiveActors = getAliveInactiveActors(
      state,
      newContext({ playerID: player.ID })
    )
    if (
      player.activeActorIDs.some((id) => id === null) &&
      inactiveLiveActors.length > 0
    ) {
      const count = Math.min(
        inactiveLiveActors.length,
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

    if (
      player.activeActorIDs.every((id) => id === null) &&
      inactiveLiveActors.length === 0
    ) {
      state = withPhase(state, 'post')
      valid = false
    }
  })

  return [state, valid]
}

function resolveDialogOption(
  state: State,
  context: DeltaPositionContext,
  option: SDialogOption
) {
  const mutations = resolveAction(state, context, option.action)
  const mutationQueue = push(state.mutationQueue, mutations)
  return {
    ...state,
    mutationQueue,
  }
}

export {
  newContext,
  decrementEffect,
  decrementEffectItem,
  pushLogs,
  pushAction,
  addActionToQueue,
  pushPrompt,
  resolvePrompt,
  handleTrigger,
  sortActionQueue,
  filterActionQueue,
  mutateActor,
  mutatePlayer,
  mutateDamage,
  withPhase,
  validateState,
  resolveDialogOption,
}
