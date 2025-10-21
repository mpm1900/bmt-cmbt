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

type SActor = Actor<State>
type SAction = Action<State, SActor>
type SEffect = Effect<State, SActor>
type SEffectItem = EffectItem<State, SActor>
type SDelta = Delta<State>
type SMutation = DeltaQueueItem<State, DeltaContext>
type SModifier = Modifier<SActor>
type STrigger = Trigger<State>
type STriggerItem = TriggerQueueItem<State>

const BattlePhases = [
  'pre',
  'start',
  'planning',
  'main',
  'end',
  'post',
] as const
type Battle = {
  turn: number
  phase: (typeof BattlePhases)[number]
  effects: Array<SEffectItem>
}

type State = {
  battle: Battle | undefined
  players: Array<Player>
  actors: Array<SActor>
  effects: Array<SEffectItem>
  actionQueue: ActionQueue<State, SActor>
  promptQueue: PromptQueue<State, SActor>
  triggerQueue: TriggerQueue<State>
  mutationQueue: DeltaQueue<State, DeltaContext>
  combatLog: string[]
}

export { BattlePhases }
export type {
  Battle,
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
}
