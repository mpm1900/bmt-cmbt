import {
  convertPositionToTargetContext,
  convertTargetToPositionContext,
  getActor,
  isActive,
  mapTarget,
} from '@/game/access'
import {
  getSourceChance,
  getTargetChance,
  newDamage,
  withChanceEvents,
} from '@/game/actor'
import { addEffectResolver, damagesResolver } from '@/game/resolvers'
import type { SAction, SEffect, State } from '@/game/state'
import type { PowerDamage } from '@/game/types/damage'
import { v4 } from 'uuid'
import { SetActionsEffect } from '../effects/set-actions'
import { newContext, remapTargetIDs } from '@/game/mutations'
import type { DeltaContext, DeltaPositionContext } from '@/game/types/delta'

const SolarBeamTargetCount = 1
const SolarBeamAccuracy = 100
const SolarBeamDamage: PowerDamage = newDamage({
  offenseStat: 'mind',
  defenseStat: 'mind',
  element: 'fire',
  power: 120,
})

const SolarBeamEffectID = v4()
function SolarBeamEffect(state: State, context: DeltaContext): SEffect {
  return {
    ...SetActionsEffect([
      SolarBeamFollowUp(convertTargetToPositionContext(state, context)),
    ]),
    ID: SolarBeamEffectID,
    name: 'Solar Beam: Charging',
  }
}

const SolarBeam: SAction = {
  ID: v4(),
  name: 'Solar Beam',
  priority: 0,
  validate: () => true,
  targets: {
    unique: true,
    get: (state, context) =>
      state.actors
        .filter((a) => a.playerID !== context.playerID && isActive(state, a.ID))
        .map((actor) => mapTarget(actor, 'position')),
    max: () => SolarBeamTargetCount,
    validate: (_state, context) =>
      context.positions.length === SolarBeamTargetCount,
  },
  resolve: (state, context) => {
    return [
      addEffectResolver(
        SolarBeamEffect(state, context),
        newContext({ ...context, parentID: context.sourceID, targetIDs: [] }),
        1
      ),
    ]
  },
}

function SolarBeamFollowUp(ctx: DeltaPositionContext): SAction {
  return {
    ID: v4(),
    name: 'Solar Beam',
    priority: 0,
    validate: () => true,
    targets: {
      unique: true,
      get: () => [],
      max: () => 0,
      validate: () => true,
    },
    resolve: (state) => {
      const context = convertPositionToTargetContext(state, ctx)
      const source = getActor(state, context.sourceID)!
      const sChance = getSourceChance(SolarBeamAccuracy, 0, source)
      const targetIDs = remapTargetIDs(state, context)

      return [
        damagesResolver(
          context,
          targetIDs.map((targetID) => {
            const target = getActor(state, targetID)!
            const tChance = getTargetChance(target)
            const damage = withChanceEvents(SolarBeamDamage, sChance, tChance)
            return damage
          }),
          targetIDs.map((targetID) => ({
            ...context,
            targetIDs: [targetID],
          })),
          0
        ),
      ]
    },
  }
}

export { SolarBeam }
