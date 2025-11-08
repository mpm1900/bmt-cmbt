import { findActor, getActor } from './access'
import { ActorFlinched } from './data/messages'
import { newMessage } from './encounter'
import { pushMessagesResolver } from './resolvers'
import type { SAction, State } from './state'
import type { DeltaContext, DeltaPositionContext } from './types/delta'

type Mutations = ReturnType<SAction['resolve']>

function resolveAction(
  state: State,
  context: DeltaContext,
  config: {
    costs?: Mutations
    onSuccess: (mutations: Mutations) => Mutations
    onError: (mutations: Mutations) => Mutations
  }
): Mutations {
  const { costs = [], onError, onSuccess } = config
  const source = getActor(state, context.sourceID)
  if (!source) return onError(costs)
  if (!source.state.alive) return onError(costs)

  if (source.state.flinching) {
    return onError(
      costs.concat(
        pushMessagesResolver(context, [
          newMessage({
            text: ActorFlinched(source),
            depth: 1,
          }),
        ])
      )
    )
  }

  return onSuccess(costs)
}

function validateAction(
  action: SAction | undefined,
  state: State,
  context: DeltaPositionContext
): boolean {
  if (!action) return false
  const source = findActor(state, context.sourceID)
  if (
    source?.cooldowns[action.ID] !== undefined &&
    source.cooldowns[action.ID] > 0
  )
    return false

  return action.validate(state, context)
}

export { resolveAction, validateAction }
