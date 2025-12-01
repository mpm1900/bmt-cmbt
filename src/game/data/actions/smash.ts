import {
  getActor,
  getAliveActiveActorsRaw,
  mapActorPosition,
  mapTarget,
} from '@/game/access'
import { resolveAction } from '@/game/action'
import {
  getDamageResult,
  getSourceChance,
  getTargetChance,
  newDamage,
  withChanceEvents,
  withDrSuccess,
} from '@/game/lib/damage'
import { getPosition } from '@/game/player'
import { damagesResolver } from '@/game/resolvers'
import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

const SmashTargetCount = 1
const SmashAccuracy = 95
const SmashCritChance = 5
const SmashDamage = newDamage({
  offenseStat: 'strength',
  defenseStat: 'strength',
  element: 'physical',
  power: 60,
  criticalModifier: 1.5,
})

const Smash: SAction = {
  ID: v4(),
  name: 'Smash',
  priority: 0,
  cooldown: () => 0,
  validate: () => true,
  targets: {
    unique: true,
    get: (s, c) =>
      getAliveActiveActorsRaw(s, (a) => a.playerID !== c.playerID).map((a) =>
        mapTarget(a, 'position')
      ),
    max: () => SmashTargetCount,
    validate: (_s, c) => c.positions.length === SmashTargetCount,
  },
  ai: {
    generateContexts: (s, c, action) => {
      return action.targets.get(s, c).map((target) => {
        const position = getPosition(s, target.target.ID)
        return {
          ...c,
          sourceID: c.sourceID,
          positions: position ? [position] : [],
        }
      })
    },
    compute: (state, context) => {
      const source = getActor(state, context.sourceID)!
      return mapActorPosition(state, context.positions[0], (a) => {
        const target = getActor(state, a.ID)!
        const result = getDamageResult(
          source,
          target,
          withDrSuccess(SmashDamage)
        )
        console.log(result)
        return 0
      })
    },
  },
  resolve: (state, context) => {
    return resolveAction(state, context, {
      costs: [],
      onSuccess: (mutations) => {
        const source = getActor(state, context.sourceID)!
        const sChance = getSourceChance(source, {
          successThreshold: SmashAccuracy,
          criticalThreshold: SmashCritChance,
        })
        const targetIDs = context.targetIDs.filter(Boolean)
        return [
          ...mutations,
          damagesResolver(
            context,
            targetIDs.map((targetID) => {
              const target = getActor(state, targetID)!
              const tChance = getTargetChance(target)
              const damage = withChanceEvents(SmashDamage, sChance, tChance)
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

export { Smash, SmashAccuracy, SmashCritChance, SmashDamage, SmashTargetCount }
