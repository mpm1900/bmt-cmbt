import { withEffects } from '@/game/queries'
import { useGameState } from '@/hooks/useGameState'
import { ActionSelectionCard } from './action-selection-card'
import { useGameUI } from '@/hooks/useGameUI'
import { Swap } from '@/game/data/actions/_system/swap'
import { CardHeader, CardTitle } from '../ui/card'
import { ActionCards } from './action-cards'
import { ActionContextBuilder } from './action-context-builder'
import { useState } from 'react'
import { newContext } from '@/game/mutations'
import { AnimatePresence } from 'motion/react'

function PhasePlanning() {
  const { state, pushAction } = useGameState((store) => store)
  const { activeActionID, activeActorID, set: setUI } = useGameUI((s) => s)

  const actors = state.actors.map((actor) => withEffects(actor, state.effects))
  const activeActor = actors.find((actor) => actor.ID === activeActorID)!
  const [context, setContext] = useState(
    newContext<{}>({ playerID: activeActor?.playerID })
  )

  if (!activeActor) return null
  const actions = activeActor.actions.concat(Swap)
  const activeAction = actions.find((action) => action.ID === activeActionID)!

  return (
    <div className="h-full flex flex-col justify-end gap-10">
      <h1 className="title text-center text-4xl text-muted-foreground">
        What will {activeActor.name} do?
      </h1>
      {activeActionID && (
        <div className="flex-1 flex flex-col items-center justify-center mb-64">
          <ActionContextBuilder
            className="min-w-120"
            playerID={activeActor.playerID}
            action={activeAction}
            sourceID={activeActor.ID}
            context={context}
            onContextChange={setContext}
            onContextConfirm={(context) => {
              pushAction(activeAction, context)
            }}
          />
        </div>
      )}
      <AnimatePresence>
        <ActionCards
          key={activeActor.ID}
          context={context}
          actions={actions}
          activeActionID={activeActionID}
          onActiveActionIDChange={(activeActionID) => setUI({ activeActionID })}
        />
      </AnimatePresence>
    </div>
  )

  return (
    <ActionSelectionCard
      playerID={activeActor.playerID}
      source={activeActor}
      actions={activeActor.actions.concat(Swap)}
      activeActionID={activeActionID}
      onActiveActionIDChange={(activeActionID) => setUI({ activeActionID })}
      onActionConfirm={(action, context) => pushAction(action, context)}
    >
      <CardHeader>
        <CardTitle className="text-center pb-4 text-3xl">
          Choose an Action
        </CardTitle>
      </CardHeader>
    </ActionSelectionCard>
  )
}

export { PhasePlanning }
