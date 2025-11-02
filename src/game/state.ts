import type { Effect, EffectItem } from './types/effect'
import type {
  ActionQueue,
  ActionQueueItem,
  DialogAction,
  PromptQueue,
} from './types/action'
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

import type {
  Dialog,
  DialogCheck,
  DialogNode,
  DialogOption,
  OptionsNode,
  ShopNode,
} from './types/dialog'
import type { Message } from './types/message'
import type { Combat } from './types/combat'
import type { Item } from './types/item'

type SActor = Actor<State>
type SPlayer = Player<State, SActor>
type SItem = Item<State, SActor>
type SAction = Action<State, SActor>
type SActionItem = ActionQueueItem<State, SActor>
type SDialogAction = DialogAction<State, SActor>
type SEffect = Effect<State, SActor>
type SEffectItem = EffectItem<State, SActor>
type SDelta = Delta<State>
type SMutation = DeltaQueueItem<State, DeltaContext>
type SModifier = Modifier<SActor>
type STrigger = Trigger<State>
type STriggerItem = TriggerQueueItem<State>
type SCombat = Combat<State, SActor>
type SDialog = Dialog<State, SActor>
type SShopeNode<T extends Object = {}> = ShopNode<State, SActor, T>
type SOptionsNode<T extends Object = {}> = OptionsNode<State, SActor, T>
type SDialogNode<T extends Object = {}> = DialogNode<State, SActor, T>
type SDialogOption = DialogOption<State, SActor>
type SDialogCheck = DialogCheck<State>

type State = {
  combat: SCombat | undefined
  dialog: SDialog
  players: Array<SPlayer>
  actors: Array<SActor>
  effects: Array<SEffectItem>
  actionQueue: ActionQueue<State, SActor>
  promptQueue: PromptQueue<State, SActor>
  triggerQueue: TriggerQueue<State>
  mutationQueue: DeltaQueue<State, DeltaContext>
  combatLog: Array<Message>
  messageLog: Array<Message>
}

function createCombat(exitNodeID: string, effects: SEffectItem[]): SCombat {
  return {
    exitNodeID,
    turn: 0,
    phase: 'pre',
    effects,
  }
}

export { createCombat }
export type {
  Combat,
  State,
  SActor,
  SPlayer,
  SItem,
  SAction,
  SActionItem,
  SDialogAction,
  SEffect,
  SEffectItem,
  SDelta,
  SMutation,
  SModifier,
  STrigger,
  STriggerItem,
  SCombat,
  SDialog,
  SOptionsNode,
  SShopeNode,
  SDialogNode,
  SDialogOption,
  SDialogCheck,
}
