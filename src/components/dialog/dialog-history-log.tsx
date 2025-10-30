import { useEffect, useRef, type ComponentProps } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '@/lib/utils'
import { useGameState } from '@/hooks/useGameState'
import { newContext } from '@/game/mutations'
import { playerStore } from '@/hooks/usePlayer'

const context = newContext({
  playerID: playerStore.getState().playerID,
})

function DialogHistoryLog({
  className,
  ...props
}: ComponentProps<typeof ScrollArea>) {
  const state = useGameState((s) => s.state)
  const messageLog = state.messageLog
  const activeNode = state.dialog.nodes.find(
    (node) => node.ID === state.dialog.activeNodeID
  )
  const activeMessages =
    activeNode?.messages(state, context).map((m) => m.ID) ?? []
  const firstMessages = messageLog.slice(0, activeMessages.length * -1)
  const lastMessages = messageLog.slice(activeMessages.length * -1)
  const showLastMessages = !lastMessages.every((m) =>
    activeMessages.includes(m.ID)
  )

  const messageLogRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (messageLogRef.current) {
      messageLogRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messageLog.length])
  return (
    <ScrollArea className={cn('max-h-50', className)} {...props}>
      <ul className="text-xs text-muted-foreground">
        {firstMessages.map((message, i) => (
          <li
            key={i + message.ID}
            style={{
              opacity: message.depth > 0 ? 0.7 : 1,
              paddingLeft: message.depth * 16,
            }}
          >
            {message.text}
          </li>
        ))}
        {showLastMessages &&
          lastMessages.map((message) => (
            <li
              key={message.ID}
              style={{
                opacity: message.depth > 0 ? 0.7 : 1,
                paddingLeft: message.depth * 16,
              }}
            >
              {message.text}
            </li>
          ))}
        <div ref={messageLogRef} />
      </ul>
    </ScrollArea>
  )
}

export { DialogHistoryLog }
