import type { SAction } from '@/game/state'
import { v4 } from 'uuid'

import { isActive, mapActor, mapTarget } from '@/game/access'
import { costResolver, damageResolver } from '@/game/resolvers'
import type { PowerDamage } from '@/game/types/damage'
import { newDamage } from '@/game/actor'

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
  resolve: (_, context) => {
    return [
      costResolver(context, (s) => ({ mana: s.mana - FireballManaCost })),
      damageResolver(context, {
        ...FireballDamage,
        success: true,
      }),
    ]
  },
}

export { Fireball, FireballDamage, FireballTargetCount }
