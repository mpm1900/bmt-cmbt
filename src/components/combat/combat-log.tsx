import { useGameState } from '@/hooks/useGameState'
import { ScrollArea } from '../ui/scroll-area'
import { useEffect, useRef, type ComponentProps } from 'react'
import { cn } from '@/lib/utils'

function CombatLog({ className, ...props }: ComponentProps<typeof ScrollArea>) {
  const combatLog = useGameState((s) => s.state.combatLog)
  const combatLogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (combatLogRef.current) {
      combatLogRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [combatLog.length])

  return (
    <ScrollArea className={cn('h-100 text-sm', className)} {...props}>
      <ul className="text-muted-foreground">
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
