import type { ComponentProps } from 'react'
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
  option,
  options,
  onOptionChange,
  ...props
}: ComponentProps<typeof DropdownMenu> & {
  disabled: boolean
  option: SingleTargetDialogOption<State, SActor>
  options: Array<DialogOptionContext>
  onOptionChange: (option: SingleTargetDialogOption<State, SActor>) => void
}) {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        {!disabled && (
          <InputGroupAddon
            className={cn('group-hover:text-foreground italic opacity-60', {
              'text-foreground opacity-90': props.open,
            })}
          >
            Select Target
          </InputGroupAddon>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((context, i) => (
          <DropdownMenuItem
            key={i}
            className="cursor-pointer"
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
