import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

import { mapActor } from '@/game/access'
import { costResolver, damageResolver } from '@/game/resolvers'
import type { PowerDamage } from '@/game/types/damage'

const FireballTargetCount = 2
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
    context.targetIDs.length > 0 &&
    !!mapActor(
      state,
      context.sourceID,
      (a) => a.state.mana >= FireballManaCost
    ),
  targets: {
    unique: true,
    get: (state, context) =>
      state.actors.filter((a) => a.ID !== context.sourceID),
    max: () => FireballTargetCount,
  },
  resolve: (_, context) => {
    return [
      costResolver(context, (s) => ({ mana: s.mana - FireballManaCost })),
      damageResolver(context, FireballDamage),
    ]
  },
}

export { Fireball, FireballDamage, FireballTargetCount }
