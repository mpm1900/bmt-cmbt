import { withEffects } from '@/game/queries'
import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'
import { Swap } from '@/game/data/actions/_system/swap'
import { ActionCards } from './action-cards'
import { ActionContextBuilder } from './action-context-builder'
import { AnimatePresence } from 'motion/react'

function PhasePlanning() {
  const { state, pushAction } = useGameState((store) => store)
  const {
    activeActionID,
    activeContext,
    setActiveContext,
    set: setUI,
  } = useGameUI((s) => s)

  const actors = state.actors.map((actor) => withEffects(actor, state.effects))
  const activeActor = actors.find(
    (actor) => actor.ID === activeContext.sourceID
  )

  if (!activeActor) return null
  const actions = activeActor.actions.concat(Swap)
  const activeAction = actions.find((action) => action.ID === activeActionID)!

  return (
    <div className="h-full flex flex-col justify-end gap-10">
      <h1 className="title text-center text-4xl text-muted-foreground py-4 hidden">
        What will {activeActor.name} do?
      </h1>
      {activeActionID && (
        <div className="flex-1 flex flex-col items-center justify-center mb-48">
          <ActionContextBuilder
            className="min-w-120"
            playerID={activeActor.playerID}
            action={activeAction}
            sourceID={activeActor.ID}
            context={activeContext}
            onContextChange={setActiveContext}
            onContextConfirm={(context) => {
              pushAction(activeAction, context)
            }}
          />
        </div>
      )}
      <AnimatePresence>
        <ActionCards
          key={activeActor.ID}
          context={activeContext}
          actions={actions}
          activeActionID={activeActionID}
          onActiveActionIDChange={(activeActionID) => setUI({ activeActionID })}
        />
      </AnimatePresence>
    </div>
  )
}

export { PhasePlanning }
