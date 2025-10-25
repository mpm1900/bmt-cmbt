import { useState, type ComponentProps, type ReactNode } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { InputGroupAddon } from '../ui/input-group'
import { cn } from '@/lib/utils'
import type {
  DialogOptionContext,
  SingleTargetDialogOption,
} from '@/game/types/dialog'
import type { SActor, State } from '@/game/state'

function DialogActorSelect({
  disabled,
  placeholder,
  value,
  option,
  options,
  onOptionChange,
  ...props
}: ComponentProps<typeof DropdownMenu> & {
  disabled: boolean
  placeholder: ReactNode
  value: string | undefined
  option: SingleTargetDialogOption<State, SActor>
  options: Array<DialogOptionContext>
  onOptionChange: (option: SingleTargetDialogOption<State, SActor>) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <DropdownMenu {...props} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {!disabled && (
          <InputGroupAddon
            className={cn('hover:text-foreground italic opacity-60', {
              'text-foreground opacity-90': open,
            })}
          >
            {value || placeholder}
          </InputGroupAddon>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((context, i) => (
          <DropdownMenuItem
            key={i}
            onSelect={() => {
              onOptionChange({
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
  )
}

export { DialogActorSelect }
