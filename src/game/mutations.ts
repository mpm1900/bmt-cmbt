import { playerStore } from '@/hooks/usePlayer'
import { v4 } from 'uuid'
import {
  findPlayer,
  getActionableActors,
  getActiveNode,
  getActor,
  getItem,
  getTriggers,
  isActive,
  mapActor,
} from './access'
import { NavigateDialog } from './data/actions/_system/navigate-dialog'
import { ActivateX } from './data/actions/_system/swap'
import { newMessage } from './encounter'
import { nextTurnPhase } from './next'
import {
  addRewards,
  getMissingActorCount,
  isPlayerDead,
  requiresPrompt,
  withActiveSize,
} from './player'
import { enqueue, pop, push, sort } from './lib/queue'
import {
  damagesResolver,
  healActorResolver,
  navigateDialogResolver,
  resolveAction,
} from './resolvers'
import type {
  SAction,
  SActor,
  SEncounter,
  SDialogNode,
  SPlayer,
  State,
  STrigger,
} from './state'
import type { CombatPhase } from './types/combat'
import type { Damage } from './types/damage'
import type { Delta, DeltaContext, DeltaQueueItem } from './types/delta'
import type { Message } from './types/message'
import * as messages from './data/messages'
import { computeDamage, decrementCooldowns } from './lib/actor'
import { newDamageResult } from './lib/damage'
import { newContext } from './lib/context'
import { gameUIStore } from '@/hooks/useGameUI'

const playerID = playerStore.getState().playerID

function enqueueMutations(
  state: State,
  mutations: Array<DeltaQueueItem<State, DeltaContext>>
): State {
  return {
    ...state,
    mutationQueue: enqueue(state.mutationQueue, mutations),
  }
}

function startDialog(state: State): State {
  const mutations = resolveAction(
    state,
    newContext({
      playerID: playerStore.getState().playerID,
    }),
    NavigateDialog(state.encounter.startNodeID, [])
  )

  return enqueueMutations(state, mutations)
}

function pushMessages(state: State, messages: Array<Message>): State {
  if (state.combat) {
    state = {
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
  context: DeltaContext,
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
  context: DeltaContext,
  action: SAction
): State {
  const existing = state.actionQueue.find(
    (i) => i.context.sourceID === context.sourceID
  )
  if (!!existing) {
    return state
  }

  state = pushAction(state, context, action)
  const maxLength = getActionableActors(state).length

  if (state.actionQueue.length === maxLength) {
    state = nextTurnPhase(state)
  }

  return state
}

function pushPrompt(
  state: State,
  context: DeltaContext,
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

function resolvePrompt(state: State, context: DeltaContext): State {
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

function sortTriggerQueue(state: State): State {
  const triggerQueue = sort(state.triggerQueue, (a, b) => {
    return b.trigger.priority - a.trigger.priority
  })

  return {
    ...state,
    triggerQueue,
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

function removeParentEffects(state: State, context: DeltaContext): State {
  return {
    ...state,
    effects: state.effects.filter(
      (i) => i.context.parentID !== context.parentID || i.effect.persist
    ),
  }
}

function mutateActor(
  state: State,
  context: DeltaContext,
  delta: Required<Delta<SActor>>
): State {
  return {
    ...state,
    actors: state.actors.map((a) => {
      if (!a.state.alive || !delta.filter(a, context)) {
        return a
      }
      return delta.apply(a, context)
    }),
  }
}

function mutatePlayer(
  state: State,
  context: DeltaContext,
  delta: Required<Delta<SPlayer>>
): State {
  return {
    ...state,
    players: state.players.map((p) => {
      if (!delta.filter(p, context)) {
        return p
      }
      return delta.apply(p, context)
    }),
  }
}

function mutateDamage(
  state: State,
  context: DeltaContext,
  damage: Damage,
  options: {
    depth: number
  }
): State {
  context.targetIDs.forEach((targetID) => {
    let result = newDamageResult({})
    const source = getActor(state, context.sourceID)!
    const target = getActor(state, targetID)!
    const fn = computeDamage(source, target, damage, (r) => {
      result = r
    })

    if (result.damage > 0) {
      state = mutateActor(state, context, {
        filter: (a) => targetID === a.ID,
        apply: (a) => fn(a),
      })
      state = handleTrigger(state, context, 'on-damage')
      state = handleTrigger(state, context, 'on-damage-dealt')
      state = pushMessages(state, [
        newMessage({
          context,
          text: messages.TargetDamagePercent(target, result.damage),
          depth: options.depth + 1,
        }),
      ])
    }

    if (result.recoil > 0) {
      state = enqueueMutations(state, [
        damagesResolver(
          newContext({
            playerID: source.playerID,
            sourceID: source.ID,
            targetIDs: [source.ID],
          }),
          [{ type: 'raw', raw: result.recoil }]
        ),
      ])
    }

    if (result.lifesteal > 0) {
      state = enqueueMutations(state, [
        healActorResolver(
          source.ID,
          newContext({
            playerID: source.playerID,
            sourceID: source.ID,
            targetIDs: [source.ID],
          }),
          result.lifesteal
        ),
      ])
    }

    if (!getActor(state, targetID)?.state.alive) {
      state = handleTrigger(state, context, 'on-death')
    }
  })

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
    if (requiresPrompt(state, player)) {
      const count = getMissingActorCount(state, player.ID)
      if (count > 0) {
        state = pushPrompt(
          state,
          newContext({
            playerID: player.ID,
          }),
          {
            ...ActivateX(count),
            priority: player.ID === state.encounter.activeNodeID ? 1 : 0,
          }
        )

        valid = false
      }
    }

    if (isPlayerDead(state, player)) {
      state = withPhase(state, 'post')
      valid = false
    }
  })

  return [state, valid]
}

function setEncounter(state: State, encounter: SEncounter | undefined): State {
  if (!encounter) return state
  return {
    ...state,
    encounter,
  }
}

function updateDialogNode(
  state: State,
  nodeID: string,
  fn: (node: SDialogNode) => SDialogNode
): State {
  return setEncounter(state, {
    ...state.encounter,
    nodes: state.encounter.nodes.map((node) =>
      node.ID === nodeID ? fn(node) : node
    ),
  })
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
    encounter: {
      ...state.encounter,
      nodeCounts: {
        ...state.encounter.nodeCounts,
        [nodeID]: (state.encounter.nodeCounts[nodeID] || 0) + 1,
      },
    },
  }
}

function remapTargetIDs(
  state: State,
  context: DeltaContext
): Array<string | undefined> {
  return context.targetIDs.map((targetID) => {
    if (targetID === undefined) {
      return state.actors.find(
        (a) => a.playerID !== context.playerID && isActive(state, a.ID)
      )?.ID
    }
    return targetID
  })
}

function removePlayer(state: State, playerID: string): State {
  return {
    ...state,
    players: state.players.filter((p) => p.ID !== playerID),
    actors: state.actors.filter((a) => a.playerID !== playerID),
    effects: state.effects.filter((e) => e.context.playerID !== playerID),
  }
}

function endCombat(state: State, encounterID: string): State {
  state = pushMessages(state, [
    newMessage({ text: messages.SeporatorBottom('Combat ended.') }),
  ])
  const encounter = findPlayer(state, encounterID)!
  state = mutatePlayer(state, newContext({}), {
    filter: (p) => p.ID == playerID,
    apply: (p) => withActiveSize(addRewards(p, encounter), 3),
  })
  state = removePlayer(state, encounterID)

  const exitNodeID = state.combat!.exitNodeID
  state = {
    ...state,
    actors: state.actors.map((a) => ({ ...a, cooldowns: {} })),
    effects: state.effects.filter((e) => e.effect.persist),
    combat: undefined,
    actionQueue: [],
    triggerQueue: [],
    mutationQueue: [
      navigateDialogResolver(exitNodeID, newContext({ playerID })),
    ],
    promptQueue: [],
  }

  gameUIStore.getState().set({ activePlayerTab: 'party' })
  return state
}

function purchaseItem(state: State, playerID: string, itemID: string): State {
  const player = state.players.find((p) => p.ID === playerID)
  const node = getActiveNode(state)
  if (!player || !node || !state.encounter.activeNodeID) return state

  const item = getItem(state, state.encounter.activeNodeID, itemID)
  if (!item) return state
  if (item.value > player.credits) return state

  state = updateDialogNode(state, node.ID, (n) =>
    n.type === 'shop'
      ? { ...n, items: n.items.filter((i) => i.ID !== itemID) }
      : n
  )
  state = mutatePlayer(state, newContext({ playerID }), {
    filter: (p) => p.ID === playerID,
    apply: (p) => ({
      ...p,
      items: [...p.items, item],
      credits: p.credits - item.value,
    }),
  })

  return state
}

function decrementActorCooldowns(state: State): State {
  return {
    ...state,
    actors: state.actors.map((a) => decrementCooldowns<State>(a)),
  }
}

export {
  addActionToQueue,
  filterActionQueue,
  removeParentEffects,
  handleTrigger,
  mutateActor,
  mutateDamage,
  mutatePlayer,
  newContext,
  enqueueMutations,
  pushAction,
  pushMessages,
  pushPrompt,
  resolvePrompt,
  sortActionQueue,
  sortPromptQueue,
  sortTriggerQueue,
  startDialog,
  updateDialogNode,
  updateDialogNodeState,
  validateState,
  withPhase,
  incrementNodeCount,
  remapTargetIDs,
  removePlayer,
  endCombat,
  setEncounter,
  purchaseItem,
  decrementActorCooldowns,
}
