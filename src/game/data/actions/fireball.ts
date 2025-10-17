import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

import { mapActor } from '@/game/access'
import { costResolver, damageResolver } from '@/game/resolvers'
import type { Damage } from '@/game/types/damage'

const FireballManaCost = 50
const FireballDamage: Damage = {
  offenseStat: 'intelligence',
  defenseStat: 'intelligence',
  element: 'fire',
  power: 50,
}

export const Fireball: SAction = {
  ID: v4(),
  name: 'Fireball',
  validate: (state, context) =>
    context.targetIDs.length == 1 &&
    !!mapActor(
      state,
      context.sourceID,
      (a) => a.state.mana >= FireballManaCost
    ),
  maxTargetCount: () => 1,
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
