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
  return (
    <motion.div
      initial={{ y: '200%' }}
      animate={{ y: '0' }}
      exit={{ y: '200%' }}
      className="flex absolute left-0 right-0 justify-center -space-x-28 -mb-32 -z-0"
    >
      {actions.map((action) => (
        <ActionCard
          key={action.ID}
          context={context}
          action={action}
          active={action.ID === activeActionID}
          onClick={() => onActiveActionIDChange(action.ID)}
        />
      ))}
    </motion.div>
  )
}

export { ActionCards }
