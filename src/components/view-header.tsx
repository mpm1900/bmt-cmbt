import { useGameState } from '@/hooks/useGameState'
import { CombatHeader } from './combat/combat-header'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Spinner } from './ui/spinner'
import { getStatus } from '@/game/next'

function ViewHeader() {
  const state = useGameState((s) => s.state)
  return (
    <div className="flex items-center justify-start gap-2 p-1">
      <Badge
        variant={state.combat ? 'outline' : 'secondary'}
        className={state.combat ? 'text-muted-foreground' : ''}
      >
        Dialog
      </Badge>
      <Badge
        variant={state.combat ? 'secondary' : 'outline'}
        className={!state.combat ? 'text-muted-foreground' : ''}
      >
        Combat
      </Badge>
      {state.combat && (
        <>
          <Separator orientation="vertical" />
          <CombatHeader />
        </>
      )}
      <Separator orientation="vertical" />
      {getStatus(state) === 'running' && <Spinner />}
    </div>
  )
}

export { ViewHeader }
