import { useEffect, useRef, type ComponentProps } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '@/lib/utils'
import { useGameState } from '@/hooks/useGameState'

function DialogHistoryLog({
  className,
  ...props
}: ComponentProps<typeof ScrollArea>) {
  const messageLog = useGameState((s) => s.state.messageLog)
  const messageLogRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (messageLogRef.current) {
      messageLogRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messageLog.length])
  return (
    <ScrollArea className={cn('max-h-50', className)} {...props}>
      <ul className="text-xs text-muted-foreground">
        {messageLog.map((message) => (
          <li key={message.ID}>{message.text}</li>
        ))}
        <div ref={messageLogRef} />
      </ul>
    </ScrollArea>
  )
}

export { DialogHistoryLog }
