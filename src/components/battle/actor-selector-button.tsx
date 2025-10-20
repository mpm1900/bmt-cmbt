import type { SActor } from '@/game/state'
import { Button } from '../ui/button'
import type { ComponentProps } from 'react'
import type { Position } from '@/game/types/player'
import { Circle, CircleOff } from 'lucide-react'

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
  return (
    <Button
      size="icon-lg"
      variant={actor ? (active ? 'default' : 'secondary') : 'ghost'}
      {...props}
      disabled={!actor || disabled}
      children={
        active ? position.index + 1 : actor ? <Circle /> : <CircleOff />
      }
    />
  )
}

export { ActorSelectorButton }
