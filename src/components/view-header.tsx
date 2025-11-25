import { useGameState } from '@/hooks/useGameState'
import { CombatHeader } from './combat/combat-header'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Spinner } from './ui/spinner'
import { getStatus } from '@/game/next'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'

function ViewHeader() {
  const state = useGameState((s) => s.state)
  return (
    <div className="flex items-center justify-start gap-2 p-1 px-3 w-full">
      <Badge variant="outline">Effects: {state.effects.length}</Badge>
      <Badge
        variant={state.combat ? 'outline' : 'secondary'}
        className={cn({ 'text-muted-foreground': state.combat })}
      >
        Dialog
      </Badge>
      <Badge
        variant={state.combat ? 'secondary' : 'outline'}
        className={cn({ 'text-muted-foreground': !state.combat })}
      >
        Combat
      </Badge>
      {state.combat && (
        <>
          <Separator orientation="vertical" />
          <CombatHeader />
        </>
      )}
      {getStatus(state) === 'running' && <Spinner />}
      <div className="flex-1" />
      <Badge variant="outline" asChild>
        <Link to="/crew">edit party</Link>
      </Badge>
    </div>
  )
}

export { ViewHeader }
