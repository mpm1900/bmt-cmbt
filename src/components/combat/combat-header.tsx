import { useGamePhase, useGameState } from '@/hooks/useGameState'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { cn } from '@/lib/utils'
import { CombatPhases } from '@/game/types/combat'

function CombatHeader() {
  const state = useGameState((s) => s.state)
  const phase = useGamePhase()
  return (
    <>
      <Badge variant="secondary">Turn {state.combat?.turn}</Badge>
      <Separator orientation="vertical" />
      {CombatPhases.filter((p) => p !== 'pre' && p !== 'post').map((p) => (
        <Badge
          key={p}
          variant={p === phase ? 'secondary' : 'outline'}
          className={cn({
            'text-muted-foreground': p !== phase,
          })}
        >
          {p}
        </Badge>
      ))}
    </>
  )
}

export { CombatHeader }
