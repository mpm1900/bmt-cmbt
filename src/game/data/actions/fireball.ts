import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

import { mapActor } from '@/game/access'
import { costResolver, damageResolver } from '@/game/resolvers'
import type { PowerDamage } from '@/game/types/damage'

const FireballTargetCount = 1
const FireballManaCost = 50
const FireballDamage: PowerDamage = {
  type: 'power',
  offenseStat: 'intelligence',
  defenseStat: 'intelligence',
  element: 'fire',
  power: 50,
}

const Fireball: SAction = {
  ID: v4(),
  name: 'Fireball',
  validate: (state, context) =>
    context.targetIDs.length == FireballTargetCount &&
    !!mapActor(
      state,
      context.sourceID,
      (a) => a.state.mana >= FireballManaCost
    ),
  maxTargetCount: () => FireballTargetCount,
  uniqueTargets: true,
  targets: (state, context) =>
    state.actors.filter((a) => a.ID !== context.sourceID),
  resolve: (_, context) => {
    return [
      costResolver(context, (s) => ({ mana: s.mana - FireballManaCost })),
      context.targetIDs.map((targetID) =>
        damageResolver({ ...context, targetIDs: [targetID] }, FireballDamage)
      ),
    ]
  },
}

export { Fireball, FireballDamage }
