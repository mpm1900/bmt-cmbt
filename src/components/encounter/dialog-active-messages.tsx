import { findActor } from '@/game/access'
import type { Message } from '@/game/types/message'
import { useGameState } from '@/hooks/useGameState'
import { cn } from '@/lib/utils'

function ActiveMessageSourceName({ sourceID }: { sourceID: string }) {
  const state = useGameState((s) => s.state)
  const actor = findActor(state, sourceID)
  return <span className="font-bold pr-2">{actor ? actor.name : '???'}:</span>
}

function DialogMessage({
  className,
  message,
  ...props
}: React.ComponentProps<'div'> & { message: Message }) {
  const { context } = message
  return (
    <div className={cn('inline', className)} {...props}>
      {!!context.sourceID && (
        <ActiveMessageSourceName sourceID={context.sourceID} />
      )}
      {message.text}
    </div>
  )
}

function DialogActiveMessages({ messages }: { messages: Message[] }) {
  return (
    <ul>
      {messages.map((message) => (
        <li key={message.ID}>
          <DialogMessage className="text-sm" message={message} />
        </li>
      ))}
    </ul>
  )
}

export { DialogActiveMessages, DialogMessage }
