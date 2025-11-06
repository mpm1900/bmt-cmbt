import type {
  Action,
  ActionQueue,
  ActionQueueItem,
  DialogAction,
  PromptQueue,
} from './types/action'
import type { Actor, ModifiedActor } from './types/actor'
import type { Combat } from './types/combat'
import type {
  Delta,
  DeltaContext,
  DeltaQueue,
  DeltaQueueItem,
} from './types/delta'
import type {
  Encounter,
  DialogCheck,
  DialogNode,
  DialogOption,
  OptionsNode,
  ShopNode,
} from './types/encounter'
import type { Effect, EffectItem } from './types/effect'
import type { Item } from './types/item'
import type { Message } from './types/message'
import type { Modifier } from './types/modifier'
import type { Player } from './types/player'
import type { Trigger, TriggerQueue, TriggerQueueItem } from './types/trigger'

type SActor = Actor<State>
type SModifiedActor = ModifiedActor<State>
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
type SEncounter = Encounter<State, SActor>
type SShopeNode<T extends Object = {}> = ShopNode<State, SActor, T>
type SOptionsNode<T extends Object = {}> = OptionsNode<State, SActor, T>
type SDialogNode<T extends Object = {}> = DialogNode<State, SActor, T>
type SDialogOption = DialogOption<State, SActor>
type SDialogCheck = DialogCheck<State>

type State = {
  combat: SCombat | undefined
  encounter: SEncounter
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

export type {
  SAction,
  SActionItem,
  SActor,
  SCombat,
  SDelta,
  SEncounter,
  SDialogAction,
  SDialogCheck,
  SDialogNode,
  SDialogOption,
  SEffect,
  SEffectItem,
  SItem,
  SModifiedActor,
  SModifier,
  SMutation,
  SOptionsNode,
  SPlayer,
  SShopeNode,
  State,
  STrigger,
  STriggerItem,
}
