import type { SActor } from '@/game/state'
import { usePlayerID } from '@/hooks/usePlayer'
import { useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { MiniDropdown } from '../mini-dropdown'
import { cn } from '@/lib/utils'

function ActorSelect({
  placeholder,
  disabled,
  options,
  onValueChange,
  ...props
}: {
  placeholder: string
  disabled: boolean
  options: Array<SActor>
  value: string | undefined
  onValueChange: (value: string) => void
}) {
  const playerID = usePlayerID()
  const value = options.find((option) => option.ID === props.value)
  const selectOptions = options.filter((o) => o.ID !== props.value)

  useEffect(() => {
    if (options.length === 1 && !value && !disabled) {
      onValueChange(options[0].ID)
    }
  }, [options.length, disabled])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MiniDropdown
          className={cn('data-[state=open]:text-foreground', {
            'text-foreground hover:text-foreground': value,
            'bg-slate-700 hover:bg-slate-700/80': value?.playerID === playerID,
            'bg-stone-700 hover:bg-stone-700/80':
              value && value?.playerID !== playerID,
          })}
          value={value?.ID}
          disabled={disabled || selectOptions.length === 0}
        >
          {value?.name || placeholder}
        </MiniDropdown>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {selectOptions.map((option) => (
            <DropdownMenuItem
              key={option.ID}
              className={cn({
                'dark:hover:bg-slate-800 border border-transparent hover:border-slate-700':
                  option.playerID === playerID,
                'dark:hover:bg-stone-800':
                  option.playerID && option.playerID !== playerID,
              })}
              onSelect={() => onValueChange(option.ID)}
            >
              {option.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ActorSelect }
