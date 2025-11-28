import { findActor } from '@/game/access'
import { Actor } from '@/game/data/messages'
import type { Message } from '@/game/types/message'
import { useGameState } from '@/hooks/useGameState'
import { cn } from '@/lib/utils'

function ActiveMessageSource({
  sourceID,
  textOnly,
}: {
  sourceID: string
  textOnly: boolean
}) {
  const state = useGameState((s) => s.state)
  const actor = findActor(state, sourceID)
  if (!actor) return <span className="font-bold pr-2">???:</span>
  if (textOnly) return <span className="pr-2">{Actor(actor)}:</span>
  return (
    <div className={cn('size-10 float-left mr-3 relative')}>
      <img
        src={actor.image}
        className="actor-portrait min-w-18 min-h-18 absolute -top-2 -left-4"
      />
      <div
        className="absolute -bottom-3 title text-md rounded-xs flex justify-center left-0 right-0 h-4 leading-3 text-center bg-black border ring ring-black"
        style={{ textShadow: '1px 1px 1px black' }}
      >
        {actor.name}
      </div>
    </div>
  )
}

function DialogMessage({
  className,
  message,
  textOnly,
  ...props
}: React.ComponentProps<'span'> & { message: Message; textOnly: boolean }) {
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
        <ActiveMessageSource sourceID={context.sourceID} textOnly={textOnly} />
      )}
      {message.text}
    </span>
  )
}

export { DialogMessage }
