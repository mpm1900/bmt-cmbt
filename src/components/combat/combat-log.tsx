import { useGameState } from '@/hooks/useGameState'
import { ScrollArea } from '../ui/scroll-area'
import { useEffect, useRef } from 'react'

function CombatLog() {
  const combatLog = useGameState((s) => s.state.combatLog)
  const combatLogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (combatLogRef.current) {
      combatLogRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [combatLog.length])

  return (
    <ScrollArea className="h-100">
      <ul className="text-sm text-muted-foreground">
        {combatLog.map((log, index) => (
          <li
            key={index}
            style={{
              opacity: log.depth > 0 ? 0.7 : 1,
              paddingLeft: log.depth * 16,
            }}
          >
            {log.text}
          </li>
        ))}
        <div ref={combatLogRef} />
      </ul>
    </ScrollArea>
  )
}

export { CombatLog }
