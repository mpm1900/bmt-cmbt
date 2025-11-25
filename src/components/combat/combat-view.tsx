import { useGameState } from '@/hooks/useGameState'
import { PhaseStart } from './phase-start'
import { PhasePlanning } from './phase-planning'
import { PhaseMain } from './phase-main'
import { PhaseEnd } from './phase-end'
import { PhasePre } from './phase-pre'
import { ViewLayoutContent } from '../view-layout'
import { PhasePost } from './phase-post'
import { PhaseController } from './phase-controller'
import type { SActionItem } from '@/game/state'

function CombatView({ current }: { current: SActionItem | undefined }) {
  const state = useGameState((store) => store.state)
  const phase = state.combat!.phase

  if (!phase) return null

  return (
    <>
      <PhaseController />
      <ViewLayoutContent>
        {phase === 'start' && <PhaseStart />}
        {phase === 'planning' && <PhasePlanning />}
        {phase === 'main' && <PhaseMain current={current} />}
        {phase === 'end' && <PhaseEnd />}
        {phase === 'pre' && <PhasePre />}
        {phase === 'post' && <PhasePost />}
      </ViewLayoutContent>
    </>
  )
}

export { CombatView }
