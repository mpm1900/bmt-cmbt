import { motion } from 'motion/react'
import type { Message } from '@/game/types/message'
import { DialogMessage } from './dialog-message'

function DialogActiveMessages({ messages }: { messages: Message[] }) {
  return (
    <motion.ul className="space-y-2 border-t border-border/50 py-4 px-2 flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <motion.li
          key={message.ID}
          className="max-w-4/5 leading-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i / 4 }}
        >
          <DialogMessage
            className="text-sm"
            message={message}
            textOnly={false}
          />
        </motion.li>
      ))}
    </motion.ul>
  )
}

export { DialogActiveMessages }
