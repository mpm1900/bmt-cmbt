import type { SAction } from '@/game/state'
import { ActionCard } from './action-card'
import { motion } from 'motion/react'
import type { DeltaContext } from '@/game/types/delta'

function ActionCards({
  context,
  actions,
  activeActionID,
  onActiveActionIDChange,
}: {
  context: DeltaContext
  actions: SAction[]
  activeActionID: string | undefined
  onActiveActionIDChange: (actionID: string) => void
}) {
  const numActions = actions.length
  const radius = 0

  return (
    <motion.div
      initial={{ y: '200%' }}
      animate={{ y: '0' }}
      exit={{ y: '200%' }}
      className="flex absolute left-0 right-0 justify-center -space-x-26 -mb-32 -z-0"
    >
      {actions.map((action, i) => {
        const rotation = i - (numActions - 1) / 2
        const translateY = radius * (1 - Math.cos(rotation * (Math.PI / 180)))

        return (
          <motion.div
            key={action.ID}
            style={{
              transformOrigin: 'bottom center',
              zIndex: action.ID === activeActionID ? 99 : i,
            }}
            animate={{
              rotate: rotation,
              y: translateY,
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            whileHover={{
              scale: 1.1,
              y: translateY,
              rotate: 0,
              zIndex: 100,
            }}
          >
            <ActionCard
              context={context}
              action={action}
              active={action.ID === activeActionID}
              onClick={() => onActiveActionIDChange(action.ID)}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export { ActionCards }
