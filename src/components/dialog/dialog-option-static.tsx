import type { ComponentProps } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { useGameState } from '@/hooks/useGameState'
import type { SDialogOption } from '@/game/state'
import { InputGroup, InputGroupAddon } from '../ui/input-group'

function DialogOptionStatic({
  className,
  index,
  option,
  ...props
}: Partial<ComponentProps<'div'>> & {
  index: number
  option: SDialogOption
}) {
  const resolveDialogOption = useGameState((s) => s.resolveDialogOption)
  return (
    <Button asChild onClick={() => resolveDialogOption(option)}>
      <InputGroup
        className={cn(
          'group justify-start px-0 dark:hover:bg-input/50 select-none [&>*]:cursor-default',
          className
        )}
        {...props}
      >
        <InputGroupAddon>{index + 1})</InputGroupAddon>
        <InputGroupAddon className={cn('group-hover:text-foreground')}>
          {option.text}
        </InputGroupAddon>
      </InputGroup>
    </Button>
  )
}

export { DialogOptionStatic }
