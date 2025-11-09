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
import { getPosition } from '@/game/player'
import {
  getSourceChance,
  getTargetChance,
  newDamage,
  withChanceEvents,
} from '@/game/lib/damage'
import { resolveAction } from '@/game/action'

const FireballTargetCount = 2
const FireballManaCost = 50
const FireballAccuracy = 100
const FireballDamage: PowerDamage = newDamage({
  offenseStat: 'mind',
  defenseStat: 'mind',
  element: 'fire',
  power: 50,
  criticalModifier: 1.5,
  recoil: 0,
})

const Fireball: SAction = {
  ID: v4(),
  name: 'Fireball',
  priority: 0,
  cooldown: () => 0,
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
        .filter((a) => a.playerID !== context.playerID && isActive(state, a.ID))
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
      return mapActorPosition(
        state,
        context.positions[0],
        (a) => a.stats.health - a.state.damage
      )
    },
  },
  resolve: (state, context) => {
    return resolveAction(state, context, {
      costs: [
        costResolver(context, (s) => ({
          mana: s.mana - FireballManaCost,
        })),
      ],
      onSuccess: (mutations) => {
        const source = getActor(state, context.sourceID)!
        const sChance = getSourceChance(source, {
          successThreshold: FireballAccuracy,
          criticalThreshold: 0,
        })
        const targetIDs = context.targetIDs.filter(Boolean)
        return [
          ...mutations,
          damagesResolver(
            context,
            targetIDs.map((targetID) => {
              const target = getActor(state, targetID)!
              const tChance = getTargetChance(target)
              const damage = withChanceEvents(FireballDamage, sChance, tChance)
              return damage
            }),
            targetIDs.map((targetID) => ({
              ...context,
              targetIDs: [targetID],
            }))
          ),
        ]
      },
      onError: (mutations) => [...mutations],
    })
  },
}

export { Fireball, FireballDamage, FireballTargetCount, FireballAccuracy }
