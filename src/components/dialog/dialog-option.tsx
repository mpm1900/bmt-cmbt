import type { SActor, SDialogOption } from '@/game/state'
import { useState, type ComponentProps } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from '../ui/input-group'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useGameState } from '@/hooks/useGameState'
import type { DeltaPositionContext } from '@/game/types/delta'

function DialogOptionContent({
  className,
  ...props
}: ComponentProps<typeof InputGroup>) {
  return (
    <InputGroup
      className={cn('dark:hover:bg-input/50', className)}
      {...props}
    />
  )
}

function DialogOptionSelect({
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
  const value = options.find((option) => option.ID === props.value)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <InputGroupButton
          className={cn('text-muted-foreground', { 'text-foreground': value })}
          disabled={disabled}
          variant="secondary"
        >
          {value?.name || placeholder}
          <ChevronDown />
        </InputGroupButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.ID}
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

function DialogOption({
  option,
  onConfirm,
}: {
  option: SDialogOption
  onConfirm: (context: DeltaPositionContext) => void
}) {
  const state = useGameState((s) => s.state)
  const [context, setContext] = useState(option.context)
  const disabled = !option.action.validate(state, context)
  const sources = option.action.sources(state, context)
  const targets = option.action.targets.get(state, context)
  const max = option.action.targets.max(state, context)
  const valid = option.action.targets.validate(state, context)

  return (
    <DialogOptionContent className={cn('group', { 'opacity-50': disabled })}>
      {sources.length > 0 && (
        <InputGroupAddon>
          <DialogOptionSelect
            placeholder="Source"
            disabled={disabled}
            options={sources}
            value={context.sourceID}
            onValueChange={(sourceID) =>
              setContext((c) => ({ ...c, sourceID }))
            }
          />
        </InputGroupAddon>
      )}
      <InputGroupAddon className="pr-2 group-hover:text-foreground/70">
        {option.text}
      </InputGroupAddon>
      {max > 0 && targets.length > 0 && (
        <InputGroupAddon className="gap-2">
          {Array.from({ length: max }).map((_, i) => (
            <DialogOptionSelect
              key={i}
              placeholder="Target"
              disabled={disabled}
              options={targets.map((t) => t.target)}
              value={context.targetIDs[i]}
              onValueChange={(targetID) =>
                setContext((c) => ({
                  ...c,
                  targetIDs: [
                    ...c.targetIDs.slice(0, i),
                    targetID,
                    ...c.targetIDs.slice(i + 1),
                  ],
                }))
              }
            />
          ))}
        </InputGroupAddon>
      )}
      <div className="flex-1" />
      {valid && !disabled && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            className="cursor-pointer rounded-full opacity-70 hover:opacity-100"
            variant="default"
            onClick={() => {
              onConfirm(context)
              setContext(option.context)
            }}
          >
            <ArrowRight />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </DialogOptionContent>
  )
}

export { DialogOption }
