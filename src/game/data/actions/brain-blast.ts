import { getActor, isActive, mapActorPosition, mapTarget } from '@/game/access'
import {
  getSourceChance,
  getTargetChance,
  newDamage,
  withChanceEvents,
} from '@/game/lib/damage'
import { getPosition } from '@/game/player'
import { damagesResolver } from '@/game/resolvers'
import type { SAction } from '@/game/state'
import type { PowerDamage } from '@/game/types/damage'
import { v4 } from 'uuid'

const BrainBlastDamage: PowerDamage = newDamage({
  offenseStat: 'insight',
  defenseStat: 'insight',
  element: 'psy',
  power: 30,
  criticalModifier: 1.5,
})

const BrainBlast: SAction = {
  ID: v4(),
  name: 'Brain Blast',
  priority: 0,
  validate: () => true,
  cooldown: () => 0,
  targets: {
    unique: true,
    max: () => 2,
    get: (state, context) =>
      state.actors
        .filter((a) => a.ID !== context.sourceID && isActive(state, a.ID))
        .map((actor) => mapTarget(actor, 'position')),
    validate: (_state, context) =>
      0 < context.positions.length && context.positions.length <= 2,
  },
  ai: {
    generateContexts: (state, context, action) => {
      return action.targets.get(state, context).map((target) => {
        const position = getPosition(state, target.target.ID)
        return {
          ...context,
          sourceID: context.sourceID,
          positions: position ? [position] : [],
        }
      })
    },
    compute: (state, context) => {
      return mapActorPosition(
        state,
        context.positions[0],
        (a) => a.stats.health - a.state.damage
      )
    },
  },
  resolve: (state, context) => {
    const targetIDs = context.targetIDs.filter(Boolean)
    return [
      targetIDs.map((targetID) => {
        const source = getSourceChance(getActor(state, context.sourceID)!, {
          successThreshold: 100,
          criticalThreshold: 0,
        })
        const target = getTargetChance(getActor(state, targetID)!, {
          ignoreEvade: true,
        })
        const damage = withChanceEvents(BrainBlastDamage, source, target)
        const ctx = { ...context, targetIDs: [targetID] }
        return damagesResolver(ctx, [damage], [ctx], 0)
      }),
    ]
  },
}

export { BrainBlast }
