import { useState, type ComponentProps } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import type { SingleTargetDialogOption } from '@/game/types/dialog'
import type { SActor, State } from '@/game/state'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { InputGroup, InputGroupAddon } from '../ui/input-group'
import { MdDoubleArrow } from 'react-icons/md'
import { useGameState } from '@/hooks/useGameState'

function DialogOptionSingleTarget({
  className,
  index,
  disabled,
  option,
  ...props
}: Partial<ComponentProps<'div'>> & {
  index: number
  disabled: boolean
  option: SingleTargetDialogOption<State, SActor>
}) {
  const state = useGameState((s) => s.state)
  const [open, setOpen] = useState(false)
  const resolveDialogOption = useGameState((s) => s.resolveDialogOption)
  return (
    <Button
      asChild
      size="sm"
      disabled={disabled}
      onClick={() => setOpen((o) => !o)}
    >
      <InputGroup
        className={cn(
          'group justify-start px-0 border-none w-full',
          {
            'dark:hover:bg-input/50 select-none [&>*]:cursor-default':
              !disabled,
          },
          {
            '[&>*]:cursor-not-allowed pointer-events-none opacity-50': disabled,
          },
          className
        )}
        {...props}
      >
        <InputGroupAddon>{index + 1}</InputGroupAddon>
        <InputGroupAddon>{option.text}</InputGroupAddon>
        {!disabled && (
          <InputGroupAddon>
            <MdDoubleArrow />
          </InputGroupAddon>
        )}

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            {!disabled && (
              <InputGroupAddon
                className={cn('group-hover:text-foreground italic opacity-60', {
                  'text-foreground opacity-90': open,
                })}
              >
                Select Target
              </InputGroupAddon>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {option.options.map((context, i) => (
              <DropdownMenuItem
                key={i}
                className="cursor-pointer"
                onSelect={() => {
                  resolveDialogOption({
                    ...option,
                    context,
                  })
                }}
              >
                {context.text}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <InputGroupAddon className="hidden group-hover:block absolute right-3 opacity-50">
          (0/{option.action.targets.max(state, option.context)})
        </InputGroupAddon>
      </InputGroup>
    </Button>
  )
}

export { DialogOptionSingleTarget }
