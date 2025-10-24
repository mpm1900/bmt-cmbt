import { useGameState } from '@/hooks/useGameState'
import { ScrollArea } from '../ui/scroll-area'
import { useEffect, useRef } from 'react'

function CombatLog({ activeTab }: { activeTab: string }) {
  const combatLog = useGameState((s) => s.state.combatLog)
  const combatLogRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (combatLogRef.current) {
      combatLogRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [combatLog.length, activeTab])
  return (
    <ScrollArea className="h-84">
      <ul className="text-sm">
        {combatLog.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
        <div ref={combatLogRef} />
      </ul>
    </ScrollArea>
  )
}

export { CombatLog }
