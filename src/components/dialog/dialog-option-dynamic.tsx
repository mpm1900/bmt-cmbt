import { useState, type ComponentProps } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import type { DynamicDialogOption } from '@/game/types/dialog'
import type { SActor, State } from '@/game/state'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { InputGroup, InputGroupAddon } from '../ui/input-group'
import { ArrowBigRight } from 'lucide-react'
import { useGameState } from '@/hooks/useGameState'

function DialogOptionDynamic({
  className,
  index,
  disabled,
  option,
  ...props
}: Partial<ComponentProps<'div'>> & {
  index: number
  disabled: boolean
  option: DynamicDialogOption<State, SActor>
}) {
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
          'group justify-start px-0 border-none',
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
        <InputGroupAddon>{index + 1})</InputGroupAddon>
        <InputGroupAddon>{option.text}</InputGroupAddon>
        {!disabled && (
          <InputGroupAddon>
            <ArrowBigRight />
          </InputGroupAddon>
        )}
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            {!disabled && (
              <InputGroupAddon
                className={cn('group-hover:text-foreground', {
                  'text-foreground': open,
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
      </InputGroup>
    </Button>
  )
}

export { DialogOptionDynamic }
