import { withStats } from '@/game/actor'
import type { SActor, SEffect, SModifier } from '@/game/state'
import type { ActorStats } from '@/game/types/actor'
import { v4 } from 'uuid'

function UpdateStatModifier(fn: (a: SActor) => Partial<ActorStats>): SModifier {
  return {
    ID: v4(),
    priority: 0,
    filter: (actor, context) => actor.ID === context.parentID,
    apply: (actor) => withStats(actor, { ...actor.stats, ...fn(actor) }),
  }
}

function UpdateStat(fn: (a: SActor) => Partial<ActorStats>): SEffect {
  return {
    ID: v4(),
    name: '__Update-Stat__',
    delay: 0,
    duration: 0,
    triggers: () => [],
    modifiers: () => [UpdateStatModifier(fn)],
  }
}

export { UpdateStat, UpdateStatModifier }
