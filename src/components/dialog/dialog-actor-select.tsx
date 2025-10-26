import { useState, type ComponentProps, type ReactNode } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { InputGroupAddon } from '../ui/input-group'
import { cn } from '@/lib/utils'
import type { SActor } from '@/game/state'

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
  options: Array<SActor>
  value: string
  onValueChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.ID === value)
  return (
    <DropdownMenu {...props} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <InputGroupAddon
          className={cn('hover:text-foreground opacity-60 hover:opacity-80', {
            italic: !value,
            'text-foreground opacity-70': selected?.name,
            'text-foreground opacity-90': open,
          })}
        >
          {selected?.name || placeholder}
        </InputGroupAddon>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((o, i) => (
          <DropdownMenuItem
            key={i}
            onSelect={() => {
              onValueChange(o.ID)
            }}
          >
            {o.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { DialogActorSelect }
