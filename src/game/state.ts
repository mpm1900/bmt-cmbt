import type { Effect, EffectItem, EffectModifier } from './types/effect'
import type { ActionQueue } from './types/action'
import type { Delta, DeltaQueue, DeltaQueueItem } from './types/delta'
import type { Trigger, TriggerQueue, TriggerQueueItem } from './types/trigger'
import type { Action } from './types/action'
import type { Actor } from './types/actor'

type Player = {
  ID: string
}
type SActor = Actor<State>
type SAction = Action<State, SActor>
type SEffect = Effect<State, SActor>
type SEffectItem = EffectItem<State, SActor>
type SDelta = Delta<State>
type SMutation = DeltaQueueItem<State>
type SModifier = EffectModifier<SActor>
type STrigger = Trigger<State>
type STriggerItem = TriggerQueueItem<State>

type State = {
  players: Array<Player>
  actors: Array<SActor>
  effects: Array<SEffectItem>
  actionQueue: ActionQueue<State, SActor>
  triggerQueue: TriggerQueue<State>
  mutationQueue: DeltaQueue<State>
}

export type {
  Player,
  State,
  SActor,
  SAction,
  SEffect,
  SDelta,
  SMutation,
  SModifier,
  STrigger,
  STriggerItem,
}
