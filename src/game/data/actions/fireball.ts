import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

import {
  getActor,
  isActive,
  mapActor,
  mapActorPosition,
  mapTarget,
} from '@/game/access'
import { costResolver, damagesResolver } from '@/game/resolvers'
import type { PowerDamage } from '@/game/types/damage'
import {
  getSourceChance,
  getTargetChance,
  newDamage,
  withChanceEvents,
} from '@/game/actor'
import { getPosition } from '@/game/player'

const FireballTargetCount = 2
const FireballManaCost = 50
const FireballDamage: PowerDamage = newDamage({
  offenseStat: 'intelligence',
  defenseStat: 'intelligence',
  element: 'fire',
  power: 50,
  criticalModifier: 1.5,
})

const Fireball: SAction = {
  ID: v4(),
  name: 'Fireball',
  validate: (state, context) =>
    !!mapActor(
      state,
      context.sourceID,
      (a) => a.state.mana >= FireballManaCost
    ),
  targets: {
    unique: true,
    get: (state, context) =>
      state.actors
        .filter((a) => a.ID !== context.sourceID && isActive(state, a.ID))
        .map((actor) => mapTarget(actor, 'position')),
    max: () => FireballTargetCount,
    validate: (_state, context) =>
      0 < context.positions.length &&
      context.positions.length <= FireballTargetCount,
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
      return (
        mapActorPosition(
          state,
          context.positions[0],
          (a) => a.stats.health - a.state.damage
        ) ?? 0
      )
    },
  },
  resolve: (state, context) => {
    const source = getActor(state, context.sourceID)!
    const sChance = getSourceChance(100, 0, source)
    return [
      costResolver(context, (s) => ({ mana: s.mana - FireballManaCost })),
      damagesResolver(
        context,
        context.targetIDs.map((targetID) => {
          const target = getActor(state, targetID)!
          const tChance = getTargetChance(target)
          const damage = withChanceEvents(FireballDamage, sChance, tChance)
          return damage
        }),
        context.targetIDs.map((targetID) => ({
          ...context,
          targetIDs: [targetID],
        }))
      ),
    ]
  },
}

export { Fireball, FireballDamage, FireballTargetCount }
