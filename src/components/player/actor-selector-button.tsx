import type { SActor } from '@/game/state'
import { Button } from '../ui/button'
import type { ComponentProps } from 'react'
import type { Position } from '@/game/types/player'
import {
  TbHexagon,
  TbHexagonOff,
  TbHexagonFilled,
  TbHexagonNumber1Filled,
  TbHexagonNumber2Filled,
  TbHexagonNumber3Filled,
} from 'react-icons/tb'
import { cn } from '@/lib/utils'

const numbers = [
  TbHexagonNumber1Filled,
  TbHexagonNumber2Filled,
  TbHexagonNumber3Filled,
]

function ActorSelectorButton({
  actor,
  position,
  disabled,
  ...props
}: ComponentProps<typeof Button> & {
  actor: SActor | undefined
  position: Position | undefined
}) {
  const active = position?.index !== undefined
  if (!actor) return <div />
  const Icon = numbers[position?.index ?? -1] ?? TbHexagonFilled

  return (
    <Button
      size="icon"
      variant={active ? 'slate-active' : 'slate'}
      className={cn({ 'opacity-50 hover:opacity-90': !actor.state.alive })}
      {...props}
      disabled={!actor || disabled}
    >
      {active ? <Icon /> : actor.state.alive ? <TbHexagon /> : <TbHexagonOff />}
    </Button>
  )
}

export { ActorSelectorButton }
