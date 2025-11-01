import { getAliveActiveActors, mapTarget } from '@/game/access'
import { healActorResolver } from '@/game/resolvers'
import type { SDialogAction } from '@/game/state'
import { v4 } from 'uuid'

const Heal: SDialogAction = {
  ID: v4(),
  name: 'Heal',
  priority: 0,
  validate: (state, context) => getAliveActiveActors(state, context).length > 0,
  targets: {
    unique: true,
    max: () => 1,
    get: (state, _context) => state.actors.map((a) => mapTarget(a, 'targetID')),
    validate: (_state, context) =>
      !!context.sourceID && context.targetIDs.length === 1,
  },
  sources: (state, context) => getAliveActiveActors(state, context),
  resolve(_, context) {
    return [healActorResolver(context.targetIDs[0], context, 20)]
  },
}

const SelfHealTarget: SDialogAction = {
  ...Heal,
  ID: v4(),
  name: 'Self Heal',
  targets: {
    ...Heal.targets,
    get: (state, context) =>
      getAliveActiveActors(state, context).map((a) => mapTarget(a, 'targetID')),
    validate: (_state, context) => context.targetIDs.length === 1,
  },
  resolve: (state, context) => {
    return Heal.resolve(state, { ...context, sourceID: context.targetIDs[0]! })
  },
  sources: () => [],
}

const SelfHealSource: SDialogAction = {
  ...Heal,
  ID: v4(),
  name: 'Self Heal',
  targets: {
    unique: true,
    max: () => 0,
    get: () => [],
    validate: (_, context) => !!context.sourceID,
  },
  resolve: (state, context) => {
    return Heal.resolve(state, { ...context, targetIDs: [context.sourceID] })
  },
}

export { Heal, SelfHealTarget, SelfHealSource }
