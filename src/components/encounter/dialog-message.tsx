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
}: React.ComponentProps<'span'> & { message: Message }) {
  const { context } = message
  return (
    <span
      className={cn(
        {
          'text-muted-foreground': message.type === 'narration',
          'text-foreground': message.type === 'dialogue',
        },
        className
      )}
      {...props}
    >
      {!!context.sourceID && (
        <ActiveMessageSourceName sourceID={context.sourceID} />
      )}
      {message.text}
    </span>
  )
}

export { DialogMessage }
