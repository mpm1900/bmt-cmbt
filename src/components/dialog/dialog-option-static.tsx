import type { ComponentProps } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { useGameState } from '@/hooks/useGameState'
import type { SDialogOption } from '@/game/state'

function DialogOptionStatic({
  className,
  index,
  option,
  ...props
}: Partial<ComponentProps<typeof Button>> & {
  index: number
  option: SDialogOption
}) {
  const resolveDialogOption = useGameState((s) => s.resolveDialogOption)
  return (
    <Button
      variant="outline"
      className={cn('w-full justify-start dark:bg-input/30', className)}
      onClick={() => resolveDialogOption(option)}
      {...props}
    >
      {index + 1}) {option.text}
    </Button>
  )
}

export { DialogOptionStatic }
