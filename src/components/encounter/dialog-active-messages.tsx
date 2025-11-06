import type { Message } from '@/game/types/message'

function DialogActiveMessages({ messages }: { messages: Message[] }) {
  return (
    <div>
      {messages.map((message) => (
        <p key={message.ID} className="text-sm">
          {message.text}
        </p>
      ))}
    </div>
  )
}

export { DialogActiveMessages }
