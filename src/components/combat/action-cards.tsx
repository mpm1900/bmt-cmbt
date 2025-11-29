import type { SAction } from '@/game/state'
import { ActionCard } from './action-card'
import { motion } from 'motion/react'
import type { DeltaContext } from '@/game/types/delta'
import { useGameState } from '@/hooks/useGameState'
import { validateAction } from '@/game/action'

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
  const state = useGameState((s) => s.state)
  const numActions = actions.length
  const radius = 0

  return (
    <motion.div
      initial={{ y: '200%' }}
      animate={{ y: '0' }}
      exit={{ y: '200%' }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 220,
      }}
      className="flex absolute left-0 right-0 justify-center -space-x-22 -mb-30 -z-0"
    >
      {actions.map((action, i) => {
        const rotation = i - (numActions - 1) / 2
        const translateY = radius * (1 - Math.cos(rotation * (Math.PI / 180)))
        const active = action.ID === activeActionID
        const disabled = !validateAction(action, state, context)

        return (
          <ActionCard
            context={context}
            action={action}
            active={action.ID === activeActionID}
            disabled={disabled}
            onClick={() => onActiveActionIDChange(action.ID)}
            key={action.ID}
            style={{
              transformOrigin: 'bottom center',
            }}
            animate={{
              y: translateY,
              translateY: active ? -20 : 0,
              zIndex: active ? 99 : i,
              rotate: rotation,
              scale: active ? 1.1 : 1,
              boxShadow: `0px 12px ${active ? 16 : 8}px black`,
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            whileHover={
              disabled
                ? {}
                : {
                    scale: 1.1,
                    y: translateY,
                    rotate: 0,
                    zIndex: 100,
                    translateY: -40,
                  }
            }
          />
        )
      })}
    </motion.div>
  )
}

export { ActionCards }
