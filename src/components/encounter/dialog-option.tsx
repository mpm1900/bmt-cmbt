import { hasNext } from '@/game/next'
import type { SDialogOption } from '@/game/state'
import type { DeltaPositionContext } from '@/game/types/delta'
import { useGameState } from '@/hooks/useGameState'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import { useState, type ComponentProps } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from '../ui/input-group'
import { ButtonGroup } from '../ui/button-group'
import { ActorSelect } from './actor-select'

function DialogOptionContent({
  className,
  disabled,
  ...props
}: ComponentProps<typeof InputGroup> & { disabled: boolean }) {
  return (
    <InputGroup
      className={cn(
        'h-8 border-none',
        { 'dark:hover:bg-input/50': !disabled },
        className
      )}
      {...props}
    />
  )
}

function DialogOption({
  option,
  onConfirm,
}: {
  index: number
  option: SDialogOption
  onConfirm: (context: DeltaPositionContext) => void
}) {
  const state = useGameState((s) => s.state)
  const [context, setContext] = useState(option.context)
  const disabled = !option.action.validate(state, context)
  const loading = hasNext(state)
  const sources = option.action.sources(state, context)
  const targets = option.action.targets.get(state, context)
  const max = option.action.targets.max(state, context)
  const valid = option.action.targets.validate(state, context)

  function getOptions(index: number) {
    return targets
      .map((t) => t.target)
      .filter(
        (t) =>
          !context.targetIDs.includes(t.ID) || context.targetIDs[index] === t.ID
      )
  }

  if (option.disable === 'hide' && disabled) return null

  return (
    <DialogOptionContent
      className={cn('group', { 'opacity-50': disabled || loading })}
      disabled={disabled || loading}
    >
      {option.icons && (
        <InputGroupAddon
          className={cn('pr-2 opacity-50 flex items-center gap-2')}
        >
          {option.icons}
        </InputGroupAddon>
      )}
      {sources.length > 0 && (
        <InputGroupAddon>
          <ActorSelect
            placeholder="Source"
            disabled={disabled || loading}
            options={sources}
            value={context.sourceID}
            onValueChange={(sourceID) =>
              setContext((c) => ({ ...c, sourceID }))
            }
          />
        </InputGroupAddon>
      )}
      <InputGroupAddon
        className={cn('pr-2', {
          'group-hover:text-foreground/70': !(disabled || loading),
        })}
      >
        {option.text}
      </InputGroupAddon>
      {max > 0 && targets.length > 0 && (
        <InputGroupAddon className="gap-2">
          {Array.from({ length: max }).map((_, i) => (
            <ActorSelect
              key={i}
              placeholder="Target"
              disabled={disabled || loading}
              options={getOptions(i)}
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
      {valid && !(disabled || loading) && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            className="cursor-pointer rounded-full opacity-70 hover:opacity-100"
            size="icon-xs"
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

function DialogOptionGroup({
  className,
  ...props
}: ComponentProps<typeof ButtonGroup>) {
  return (
    <ButtonGroup
      orientation="vertical"
      className={cn('flex flex-col gap-0 w-full')}
      {...props}
    />
  )
}

export { DialogOption, DialogOptionGroup }
