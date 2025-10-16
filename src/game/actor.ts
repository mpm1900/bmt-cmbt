import type { SActor, SModifier } from './state'

function withState(actor: SActor, state: Partial<SActor['state']>): SActor {
  return {
    ...actor,
    state: {
      ...actor.state,
      ...(state as SActor['state']),
    },
  }
}

function withStats(actor: SActor, stats: Partial<SActor['stats']>): SActor {
  return {
    ...actor,
    stats: {
      ...actor.stats,
      ...(stats as SActor['stats']),
    },
  }
}

function withModifiers(
  actor: SActor,
  modifiers: Array<SModifier>
): [SActor, Array<SModifier>] {
  if (actor.modified) {
    console.error('already modified', actor, modifiers)
    return [actor, []]
  }

  const applied: Array<SModifier> = []
  actor = modifiers.reduce<SActor>(
    (next, modifier) => {
      if (
        modifier.delta.filter &&
        !modifier.delta.filter(next, modifier.context)
      ) {
        return next
      }

      applied.push(modifier)
      return modifier.delta.apply(next, modifier.context)
    },
    { ...actor }
  )
  actor.modified = true
  return [actor, applied]
}

export { withState, withStats, withModifiers }
