import { useGameState } from '@/hooks/useGameState'
import { ActionSelectionCard } from './action-selection-card'
import { findActor, getActiveActorIDs, getActor } from '@/game/access'
import { CardHeader, CardTitle } from '../ui/card'
import type { SAction, SActionItem, SActor } from '@/game/state'
import { usePlayerID } from '@/hooks/usePlayer'
import type { DeltaContext } from '@/game/types/trigger'
import type { DeltaPositionContext } from '@/game/types/delta'
import { AnimatePresence } from 'motion/react'
import { motion } from 'motion/react'

function PhaseMain({ current }: { current: SActionItem | undefined }) {
  const { state, resolvePrompt } = useGameState((s) => s)
  const playerID = usePlayerID()
  const prompt = state.promptQueue[0]
  const promptSource = getActor(state, prompt?.context.sourceID)
  const currentSource = getActor(state, current?.context.sourceID)
  const hasPrompt =
    prompt && promptSource && prompt.context.playerID === playerID
  const hasRender = !hasPrompt && current && currentSource

  return (
    <AnimatePresence mode="wait">
      {hasPrompt && (
        <PhaseMainPrompt
          key={prompt.ID}
          action={prompt.action}
          context={prompt.context}
          source={promptSource}
          onActionConfirm={(context) => resolvePrompt(context)}
        />
      )}
      {hasRender && (
        <PhaseMainRenderer
          key={current.ID}
          action={current.action}
          context={current.context}
          source={currentSource}
        />
      )}
    </AnimatePresence>
  )
}

function PhaseMainPrompt({
  context,
  source,
  action,
  onActionConfirm,
}: {
  context: DeltaContext
  source: SActor
  action: SAction
  onActionConfirm: (context: DeltaPositionContext) => void
}) {
  return (
    <ActionSelectionCard
      playerID={context.playerID}
      source={source}
      actions={[action]}
      activeActionID={action.ID}
      onActiveActionIDChange={() => {}}
      onActionConfirm={(_action, context) => {
        onActionConfirm(context)
      }}
    >
      <CardHeader>
        <CardTitle>Select Character(s)</CardTitle>
      </CardHeader>
    </ActionSelectionCard>
  )
}

function PhaseMainRenderer({
  action,
  source,
  context,
}: {
  action: SAction
  source: SActor
  context: DeltaPositionContext
}) {
  const state = useGameState((s) => s.state)
  const targets = context.targetIDs
    .map((id) => findActor(state, id))
    .filter(Boolean)
  const positions = context.positions
    .map((p) =>
      findActor(
        state,
        getActiveActorIDs(state, p.playerID)[p.index] ?? undefined
      )
    )
    .filter(Boolean)
  const names = new Set(
    targets.map((t) => t?.name).concat(positions.map((p) => p?.name))
  )

  return (
    <motion.div
      className="w-172 text-center self-center justify-self-center m-auto"
      transition={{ duration: 0.4 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">{source.name} uses</div>
      <h1 className="text-6xl font-black text-center">{action.name}</h1>
      <div>{Array.from(names).join(', ')}</div>
    </motion.div>
  )
}

export { PhaseMain }
