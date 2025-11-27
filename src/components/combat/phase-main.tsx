import { useGameState } from '@/hooks/useGameState'
import { ActionSelectionCard } from './action-selection-card'
import { getActor } from '@/game/access'
import { CardHeader, CardTitle } from '../ui/card'
import type { SAction, SActionItem, SActor } from '@/game/state'
import { usePlayerID } from '@/hooks/usePlayer'
import type { DeltaContext } from '@/game/types/delta'
import { AnimatePresence } from 'motion/react'
import { motion } from 'motion/react'

function PhaseMain({ current }: { current: SActionItem | undefined }) {
  const { state, resolvePrompt } = useGameState((s) => s)
  const playerID = usePlayerID()
  const prompt = state.promptQueue[0]
  const promptSource = getActor(state, prompt?.context.sourceID)
  const currentSource = getActor(state, current?.context.sourceID)
  const hasPrompt = prompt && prompt.context.playerID === playerID
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
  source: SActor | undefined
  action: SAction
  onActionConfirm: (context: DeltaContext) => void
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
        <CardTitle className="text-center">Select Fighters</CardTitle>
      </CardHeader>
    </ActionSelectionCard>
  )
}

function PhaseMainRenderer({
  action,
  source,
}: {
  action: SAction
  source: SActor
  context: DeltaContext
}) {
  return (
    <motion.div
      className="w-full text-center self-center justify-self-center m-auto z-30 py-20"
      transition={{ duration: 0.4 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        background:
          'radial-gradient(ellipse at center,rgba(0, 0, 0, 0.73) 0%, rgba(0, 0, 0, 0.55) 5%, rgba(0, 0, 0, 0) 40%)',
      }}
    >
      <div className="text-center text-muted-foreground">
        <span className="title text-xl text-white">{source.name}</span> uses
      </div>
      <div className="relative">
        <div className="absolute w-80 h-full top-0 left-46 z-0" />
        <h1 className="text-7xl font-black text-center z-10 relative text-shadow-lg title">
          {action.name}
        </h1>
      </div>
    </motion.div>
  )
}

export { PhaseMain }
