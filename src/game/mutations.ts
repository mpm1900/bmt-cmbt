import { playerStore } from '@/hooks/usePlayer'
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
import { NavigateDialog } from './data/actions/_system/navigate-dialog'
import { ActivateX } from './data/actions/_system/swap'
import { newMessage } from './dialog'
import { nextTurnPhase } from './next'
import { getMissingActorCount } from './player'
import { enqueue, pop, push, sort } from './queue'
import { resolveAction } from './resolvers'
import type {
  SAction,
  SActor,
  SDialogNode,
  SDialogOption,
  SEffect,
  SEffectItem,
  SPlayer,
  State,
  STrigger,
} from './state'
import type { CombatPhase } from './types/combat'
import type { Damage } from './types/damage'
import type { Delta, DeltaContext, DeltaPositionContext } from './types/delta'
import type { Message } from './types/message'

function newContext<T = {}>(
  context: Partial<DeltaContext> & T
): DeltaPositionContext & T {
  return {
    playerID: '',
    sourceID: '',
    parentID: '',
    targetIDs: [],
    positions: [],
    ...context,
  }
}

function startDialog(state: State): State {
  const mutations = resolveAction(
    state,
    newContext({
      playerID: playerStore.getState().playerID,
    }),
    NavigateDialog(state.dialog.startNodeID, [])
  )

  return {
    ...state,
    mutationQueue: push(state.mutationQueue, mutations),
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

function pushMessages(state: State, messages: Array<Message>): State {
  if (state.combat) {
    return {
      ...state,
      combatLog: [...state.combatLog, ...messages],
    }
  }

  return {
    ...state,
    messageLog: [...state.messageLog, ...messages],
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
    context: {
      ...context,
      parentID: '',
    },
  }))
  const triggerQueue = enqueue(state.triggerQueue, items)

  return {
    ...state,
    triggerQueue,
  }
}

function sortPromptQueue(state: State): State {
  const promptQueue = sort(state.promptQueue, (a, b) => {
    return b.action.priority - a.action.priority
  })

  return {
    ...state,
    promptQueue,
  }
}

function sortActionQueue(state: State): State {
  const actionQueue = sort(state.actionQueue, (a, b) => {
    if (a.action.priority !== b.action.priority) {
      return b.action.priority - a.action.priority
    }
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
  delta: Delta<SPlayer>
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
      if ((damage.type === 'power' && !source) || !target) return ac
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
    state = handleTrigger(state, context, 'on-damage')
    state = handleTrigger(state, context, 'on-damage-dealt')
    state = pushMessages(state, [
      newMessage({
        context,
        text: `${target?.name} took ${committed} damage.`,
        depth: 1,
      }),
    ])
  }

  if (dead) {
    state = handleTrigger(state, context, 'on-death')
  }

  return state
}

function withPhase(state: State, phase: CombatPhase): State {
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
  if (!state.combat) return [state, valid]
  state.players.forEach((player) => {
    const inactiveLiveActors = getAliveInactiveActors(
      state,
      newContext({ playerID: player.ID })
    )
    if (
      player.activeActorIDs.some((id) => id === null) &&
      inactiveLiveActors.length > 0
    ) {
      const count = getMissingActorCount(state, player.ID)
      if (count > 0) {
        state = pushPrompt(
          state,
          newContext({
            playerID: player.ID,
          }),
          {
            ...ActivateX(count),
            priority: player.ID === state.dialog.activeNodeID ? 1 : 0,
          }
        )

        valid = false
      }
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

function updateDialogNode(
  state: State,
  nodeID: string,
  fn: (node: SDialogNode) => SDialogNode
): State {
  return {
    ...state,
    dialog: {
      ...state.dialog,
      nodes: state.dialog.nodes.map((node) =>
        node.ID === nodeID ? fn(node) : node
      ),
    },
  }
}

function updateDialogNodeState<T = unknown>(
  state: State,
  nodeID: string,
  fn: (state: T) => Partial<T>
): State {
  return updateDialogNode(state, nodeID, (node) => ({
    ...node,
    state: {
      ...node.state,
      ...fn(node.state as T),
    },
  }))
}

function incrementNodeCount(state: State, nodeID: string): State {
  return {
    ...state,
    dialog: {
      ...state.dialog,
      nodeCounts: {
        ...state.dialog.nodeCounts,
        [nodeID]: (state.dialog.nodeCounts[nodeID] || 0) + 1,
      },
    },
  }
}

export {
  addActionToQueue,
  decrementEffect,
  decrementEffectItem,
  filterActionQueue,
  handleTrigger,
  mutateActor,
  mutateDamage,
  mutatePlayer,
  newContext,
  pushAction,
  pushMessages,
  pushPrompt,
  resolveDialogOption,
  resolvePrompt,
  sortActionQueue,
  sortPromptQueue,
  startDialog,
  updateDialogNode,
  updateDialogNodeState,
  validateState,
  withPhase,
  incrementNodeCount,
}
