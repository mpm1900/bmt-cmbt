import { useGameState } from '@/hooks/useGameState'
import { PhaseStart } from './phase-start'
import { PhasePlanning } from './phase-planning'
import { PhaseMain } from './phase-main'
import { Tabs } from '../ui/tabs'
import { useGameUI } from '@/hooks/useGameUI'
import { PhaseEnd } from './phase-end'
import { PhasePre } from './phase-pre'
import { ViewLayout } from '../view-layout'
import { PhasePost } from './phase-post'
import { PhaseController } from './phase-controller'
import { findActor, nextAvailableAction } from '@/game/access'
import { CombatAside } from './combat-aside'
import type { SActionItem } from '@/game/state'

function CombatView({ current }: { current: SActionItem | undefined }) {
  const state = useGameState((store) => store.state)
  const phase = state.combat!.phase
  const { set, activeActorID } = useGameUI((s) => s)
  const activeActor = findActor(state, activeActorID)

  if (!phase) return null

  return (
    <>
      <PhaseController />
      <ViewLayout
        main={
          <Tabs
            defaultValue="actions"
            className="h-120"
            onValueChange={() => {
              set({
                activeActionID: nextAvailableAction(activeActor, state)?.ID,
              })
            }}
          >
            {phase === 'start' && <PhaseStart />}
            {phase === 'planning' && <PhasePlanning />}
            {phase === 'main' && <PhaseMain current={current} />}
            {phase === 'end' && <PhaseEnd />}
            {phase === 'pre' && <PhasePre />}
            {phase === 'post' && <PhasePost />}
          </Tabs>
        }
        aside={<CombatAside />}
      />
    </>
  )
}

export { CombatView }
