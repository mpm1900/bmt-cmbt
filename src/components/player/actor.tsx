import type { State, SActor } from '@/game/state'
import { ItemContent, ItemTitle } from '../ui/item'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { MAIN_STAT_ICONS } from '@/renderers/icons'
import { useGameState } from '@/hooks/useGameState'
import { useState } from 'react'
import { ActorHealth } from './actor-health'
import { ActorStatus } from './actor-status'
import { EffectBadge } from '../effect-badge'
import { getHealth } from '@/game/lib/actor'
import { getActor } from '@/game/access'
import { motion, AnimatePresence } from 'motion/react'

function Actor({
  actorID,
  active,
  disabled,
  status,
  onClick,
  ...rest
}: Omit<React.ComponentProps<typeof motion.div>, 'onClick'> & {
  actorID: string
  active: boolean
  disabled: boolean
  status: string
  onClick: (actor: SActor) => void
}) {
  const state = useGameState((s) => s.state)
  const [openTooltipCount, setOpenTooltipCount] = useState(0)
  const actor = getActor(state, actorID)!
  const [health, maxHealth] = getHealth<State>(actor)

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: '0%', opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      className="group flex flex-col justify-end w-64 absolute bottom-0"
      data-state={openTooltipCount > 0 ? 'open' : 'closed'}
      {...rest}
    >
      <div className="flex transition-all justify-between h-6 translate-y-2 group-hover:-translate-y-1 group-data-[state=open]:-translate-y-1 z-10">
        <div className="flex -space-x-3 group-hover:space-x-1 group-data-[state=open]:space-x-1 transition-all flex-wrap">
          <AnimatePresence>
            {Object.entries(actor.applied).map(([effectID, count]) => (
              <motion.div
                key={effectID}
                layout
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <EffectBadge
                  effectID={effectID}
                  count={count}
                  side="top"
                  onOpenChange={(open) => {
                    setOpenTooltipCount((prev) => prev + (open ? 1 : -1))
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <Button
        variant={active ? 'slate-active' : 'slate'}
        disabled={disabled}
        className={cn('h-auto p-2 pb-1 border border-slate-950')}
        onClick={() => onClick(actor)}
      >
        <ItemContent className="gap-0">
          <ItemTitle className="font-semibold">{actor.name}</ItemTitle>
          <ActorHealth
            active={active}
            showHealthNumbers={true}
            health={actor.state.alive ? health : 0}
            maxHealth={maxHealth}
          />

          <div className="flex gap-3 mt-1">
            <div className="flex gap-1 items-center">
              <MAIN_STAT_ICONS.body />
              {actor.stats.body}
            </div>
            <div className="flex gap-1 items-center">
              <MAIN_STAT_ICONS.reflexes />
              {actor.stats.reflexes}
            </div>
            <div className="flex gap-1 items-center">
              <MAIN_STAT_ICONS.mind />
              {actor.stats.mind}
            </div>
          </div>
        </ItemContent>
      </Button>
      <ActorStatus actor={actor} />
    </motion.div>
  )
}

function EnemyActor({
  actorID,
  active,
  targeted,
  ...rest
}: React.ComponentProps<typeof motion.div> & {
  actorID: string
  active: boolean
  targeted: boolean
}) {
  const state = useGameState((s) => s.state)
  const actor = getActor(state, actorID)!
  const [health, maxHealth] = getHealth<State>(actor)
  const [openTooltipCount, setOpenTooltipCount] = useState(0)

  return (
    <motion.div
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: '0%', opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      className="group flex flex-col w-48 h-14 absolute top-0"
      data-state={openTooltipCount > 0 ? 'open' : 'closed'}
      {...rest}
    >
      <Button
        variant={targeted ? 'destructive' : active ? 'default' : 'stone'}
        className="h-14 py-1 px-2 pointer-events-none border border-stone-950"
      >
        <ItemContent className="gap-0">
          <ItemTitle className="text-xs">{actor.name}</ItemTitle>
          <ActorHealth
            active={active}
            showHealthNumbers={false}
            health={actor.state.alive ? health : 0}
            maxHealth={maxHealth}
          />
        </ItemContent>
      </Button>
      <div className="flex transition-all justify-between h-6 -translate-y-2 group-hover:translate-y-1 group-data-[state=open]:translate-y-1 z-10">
        <div className="flex -space-x-3 group-hover:space-x-1 group-data-[state=open]:space-x-1 transition-all flex-wrap">
          <AnimatePresence>
            {Object.entries(actor.applied).map(([effectID, count]) => (
              <motion.div
                key={effectID}
                layout
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <EffectBadge
                  effectID={effectID}
                  count={count}
                  onOpenChange={(open) => {
                    setOpenTooltipCount((prev) => prev + (open ? 1 : -1))
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export { Actor, EnemyActor }
