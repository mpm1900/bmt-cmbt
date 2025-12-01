import { useRef, type ComponentProps } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '@/lib/utils'
import { useGameState } from '@/hooks/useGameState'
import { newContext } from '@/game/mutations'
import { playerStore } from '@/hooks/usePlayer'
import { useLayoutEffect } from '@tanstack/react-router'
import { DialogMessage } from './dialog-message'
import { getEncounterState } from '@/game/access'

const context = newContext({
  playerID: playerStore.getState().playerID,
})

function DialogHistoryLog({
  className,
  ...props
}: ComponentProps<typeof ScrollArea>) {
  const state = useGameState((s) => s.state)
  const messageLog = state.messageLog
  const estate = getEncounterState(state)
  const activeNode = state.encounter.nodes.find(
    (node) => node.ID === estate.activeNodeID
  )
  const activeMessages =
    activeNode?.messages(state, context).map((m) => m.ID) ?? []

  const messageLogRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (messageLogRef.current) {
      messageLogRef.current.scrollIntoView({ behavior: 'auto' })
    }
  }, [messageLog.length])

  return (
    <ScrollArea className={cn('max-h-50 px-3 pt-4', className)} {...props}>
      <ul className="text-xs text-muted-foreground pt-2">
        {messageLog
          .filter((m) => !activeMessages.includes(m.ID))
          .map((message, i) => (
            <li
              key={i + message.ID}
              className="hover:bg-muted/50"
              style={{
                opacity: message.depth > 0 ? 0.7 : 1,
                paddingLeft: message.depth * 16,
              }}
            >
              <DialogMessage message={message} textOnly />
            </li>
          ))}
        <div ref={messageLogRef} />
      </ul>
    </ScrollArea>
  )
}

export { DialogHistoryLog }
