import type { Message } from '@/game/types/message'
import { DialogMessage } from './dialog-message'

function DialogActiveMessages({ messages }: { messages: Message[] }) {
  return (
    <ul className="space-y-2 border-t pt-2">
      {messages.map((message) => (
        <li key={message.ID} className="max-w-4/5 leading-1.5">
          <DialogMessage
            className="text-sm"
            message={message}
            textOnly={false}
          />
        </li>
      ))}
    </ul>
  )
}

export { DialogActiveMessages }
