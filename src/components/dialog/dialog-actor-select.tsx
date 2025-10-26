import { useState, type ComponentProps, type ReactNode } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { InputGroupAddon } from '../ui/input-group'
import { cn } from '@/lib/utils'
import type { DialogOptionContext } from '@/game/types/dialog'

function DialogActorSelect({
  disabled,
  placeholder,
  options,
  value,
  onValueChange,
  ...props
}: ComponentProps<typeof DropdownMenu> & {
  disabled: boolean
  placeholder: ReactNode
  options: Array<DialogOptionContext>
  value: DialogOptionContext
  onValueChange: (value: DialogOptionContext) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <DropdownMenu {...props} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <InputGroupAddon
          className={cn('hover:text-foreground opacity-60 hover:opacity-80', {
            italic: !value,
            'text-foreground opacity-70': value.text,
            'text-foreground opacity-90': open,
          })}
        >
          {value.text || placeholder}
        </InputGroupAddon>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((context, i) => (
          <DropdownMenuItem
            key={i}
            onSelect={() => {
              onValueChange(context)
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
