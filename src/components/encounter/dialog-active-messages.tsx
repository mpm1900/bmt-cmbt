import type { Message } from '@/game/types/message'
import { DialogMessage } from './dialog-message'

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

export { DialogActiveMessages }
