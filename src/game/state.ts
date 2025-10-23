import type { Effect, EffectItem } from './types/effect'
import type { ActionQueue, PromptQueue } from './types/action'
import type {
  Delta,
  DeltaContext,
  DeltaQueue,
  DeltaQueueItem,
} from './types/delta'
import type { Trigger, TriggerQueue, TriggerQueueItem } from './types/trigger'
import type { Action } from './types/action'
import type { Actor } from './types/actor'
import type { Modifier } from './types/modifier'
import type { Player } from './types/player'

import {
  HANDLE_DEATH,
  HANDLE_TURN_END,
  HANDLE_TURN_START,
} from './data/effects/_system'
import { newContext } from './mutations'
import { v4 } from 'uuid'
import type {
  Dialog,
  DialogCheck,
  DialogMessage,
  DialogNode,
  DialogOption,
} from './types/dialog'

type SActor = Actor<State>
type SAction = Action<State, SActor>
type SEffect = Effect<State, SActor>
type SEffectItem = EffectItem<State, SActor>
type SDelta = Delta<State>
type SMutation = DeltaQueueItem<State, DeltaContext>
type SModifier = Modifier<SActor>
type STrigger = Trigger<State>
type STriggerItem = TriggerQueueItem<State>
type SDialog = Dialog<State, SActor>
type SDialogNode = DialogNode<State, SActor>
type SDialogOption = DialogOption<State, SActor>
type SDialogMessage = DialogMessage
type SDialogCheck = DialogCheck<State>

const CombatPhases = [
  'pre',
  'start',
  'planning',
  'main',
  'end',
  'post',
] as const

type Combat = {
  turn: number
  phase: (typeof CombatPhases)[number]
  effects: Array<SEffectItem>
}

type CombatLogItem = string

type State = {
  combat: Combat | undefined
  dialog: SDialog
  players: Array<Player>
  actors: Array<SActor>
  effects: Array<SEffectItem>
  actionQueue: ActionQueue<State, SActor>
  promptQueue: PromptQueue<State, SActor>
  triggerQueue: TriggerQueue<State>
  mutationQueue: DeltaQueue<State, DeltaContext>
  combatLog: Array<CombatLogItem>
  messageLog: Array<SDialogMessage>
}

function createCombat(): Combat {
  return {
    turn: 0,
    phase: 'pre',
    effects: [
      {
        ID: v4(),
        effect: HANDLE_DEATH,
        context: newContext({}),
      },
      {
        ID: v4(),
        effect: HANDLE_TURN_START,
        context: newContext({}),
      },
      {
        ID: v4(),
        effect: HANDLE_TURN_END,
        context: newContext({}),
      },
    ],
  }
}

export { CombatPhases, createCombat }
export type {
  Combat,
  State,
  SActor,
  SAction,
  SEffect,
  SEffectItem,
  SDelta,
  SMutation,
  SModifier,
  STrigger,
  STriggerItem,
  CombatLogItem,
  SDialog,
  SDialogNode,
  SDialogOption,
  SDialogMessage,
  SDialogCheck,
}
