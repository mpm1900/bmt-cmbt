import { portraits } from '@/renderers/portraits'
import type { State, SActor } from '@/game/state'
import { ItemContent, ItemTitle } from '../ui/item'
import { useGameState } from '@/hooks/useGameState'
import { useLayoutEffect, useRef, useState } from 'react'
import { ActorHealth } from './actor-health'
import { ActorStatus } from './actor-status'
import { EffectBadge } from '../effect-badge'
import { getHealth } from '@/game/lib/actor'
import { getActor } from '@/game/access'
import { motion, AnimatePresence } from 'motion/react'
import { ActorBg } from './actor-bg'
import { Badge } from '../ui/badge'
import { cn } from '@/lib/utils'
import { useGameUI } from '@/hooks/useGameUI'

function Actor({
  actorID,
  active,
  index,
  targeted,
  disabled,
  status,
  onClick,
  ...rest
}: Omit<React.ComponentProps<typeof motion.div>, 'onClick'> & {
  actorID: string
  active: boolean
  index: number
  targeted: boolean
  disabled: boolean
  status: string
  onClick: (actor: SActor) => void
}) {
  const state = useGameState((s) => s.state)
  const { hoverActorID, setActiveRefs } = useGameUI((s) => ({
    hoverActorID: s.hoverActorID,
    setActiveRefs: s.setActiveRefs,
  }))
  const ref = useRef<HTMLDivElement>(null)

  const [openTooltipCount, setOpenTooltipCount] = useState(0)
  const actor = getActor(state, actorID)!
  const [_health, maxHealth] = getHealth<State>(actor)
  const health = actor.state.alive ? _health : 0
  disabled = disabled || actor.state.stunned === 1
  targeted = targeted || hoverActorID === actorID

  useLayoutEffect(() => {
    if (ref.current !== null) {
      setActiveRefs(
        actor.playerID,
        index,
        ref as React.RefObject<HTMLDivElement>
      )
    }
  }, [actor.playerID, index, ref])

  return (
    <motion.div
      ref={ref}
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: '0%', opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      className="group flex flex-col justify-end w-64 absolute bottom-0"
      data-state={openTooltipCount > 0 ? 'open' : 'closed'}
      {...rest}
    >
      <div className="flex transition-all justify-between h-6 translate-y-2 group-hover:-translate-y-1.5 group-data-[state=open]:-translate-y-1.5 z-10">
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
      {state.combat?.phase === 'planning' && (
        <ActorStatus actor={actor} className="absolute top-8 right-2" />
      )}
      <ActorBg
        variant={targeted ? 'targeted' : active ? 'ally-active' : 'ally'}
        disabled={disabled}
        onClick={() => onClick(actor)}
        className={cn('flex pl-10 relative', {
          'opacity-50': disabled && !active,
        })}
      >
        <div className="absolute -left-8 -top-3 size-25 overflow-hidden z-0">
          <img
            src={portraits[actor.image]}
            className="actor-portrait"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <Badge
          className="absolute -left-2 -bottom-2 bg-slate-900 border-slate-700 rounded-xs ring ring-black"
          variant="outline"
        >
          9999
        </Badge>
        <div className="flex-1 z-10">
          <ItemContent className="gap-0">
            <ItemTitle className="text-xl title pl-2 shadow-xl">
              {actor.name}
            </ItemTitle>
            <ActorHealth
              showHealthNumbers={true}
              health={health}
              maxHealth={maxHealth}
              className="-mt-0.5 h-6"
            >
              {_health <= 0 && actor.state.alive && (
                <span className="text-destructive-foreground uppercase">
                  Death's Door
                </span>
              )}
            </ActorHealth>
            <span className="text-xs h-4">resource bars here</span>
          </ItemContent>
        </div>
      </ActorBg>
    </motion.div>
  )
}

function EnemyActor({
  actorID,
  active,
  index,
  targeted,
  ...rest
}: React.ComponentProps<typeof motion.div> & {
  actorID: string
  active: boolean
  index: number
  targeted: boolean
}) {
  const state = useGameState((s) => s.state)
  const { hoverActorID, setActiveRefs } = useGameUI((s) => ({
    hoverActorID: s.hoverActorID,
    setActiveRefs: s.setActiveRefs,
  }))
  const ref = useRef<HTMLDivElement>(null)

  targeted = targeted || hoverActorID === actorID
  const actor = getActor(state, actorID)!
  const [_health, maxHealth] = getHealth<State>(actor)
  const health = actor.state.alive ? _health : 0
  const [openTooltipCount, setOpenTooltipCount] = useState(0)

  useLayoutEffect(() => {
    if (ref.current !== null) {
      setActiveRefs(
        actor.playerID,
        index,
        ref as React.RefObject<HTMLDivElement>
      )
    }
  }, [actor.playerID, index, ref])

  return (
    <motion.div
      ref={ref}
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: '0%', opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      className="group flex flex-col w-48 h-14 absolute top-0"
      data-state={openTooltipCount > 0 ? 'open' : 'closed'}
      {...rest}
    >
      <ActorBg
        variant={targeted ? 'targeted' : active ? 'enemy-active' : 'enemy'}
        className="h-14 py-1 px-2 pointer-events-none border border-stone-950"
      >
        <ItemContent className="gap-0">
          <ItemTitle className="text-base title">{actor.name}</ItemTitle>
          <ActorHealth
            showHealthNumbers={false}
            health={health}
            maxHealth={maxHealth}
          ></ActorHealth>
        </ItemContent>
      </ActorBg>
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
