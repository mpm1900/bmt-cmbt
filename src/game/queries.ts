import type { State } from './state'
import type { DeltaContext } from './types/delta'
import { withEffects } from './lib/actor'
import type { Position } from './types/player'

function isTargeted(
  state: State,
  context: DeltaContext | undefined,
  actorID: string | null,
  position: Position
) {
  const phase = state.combat?.phase
  const planning = phase === 'planning'
  const idTargeted =
    !planning && !!context?.targetIDs.includes(actorID ?? undefined)
  const posTargeted =
    !planning &&
    !!context?.positions.find(
      (p) => p.playerID === position.playerID && p.index === position.index
    )

  return idTargeted || posTargeted
}

export { withEffects, isTargeted }
