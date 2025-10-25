import { useState, type ComponentProps } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import type { SingleTargetDialogOption } from '@/game/types/dialog'
import type { SActor, State } from '@/game/state'
import { InputGroup, InputGroupAddon } from '../ui/input-group'
import { MdDoubleArrow } from 'react-icons/md'
import { useGameState } from '@/hooks/useGameState'
import { DialogActorSelect } from './dialog-actor-select'
import { validateSingleTargetDialogOption } from '@/game/dialog'

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
  const resolveDialogOption = useGameState((s) => s.resolveDialogOption)
  const [open, setOpen] = useState(false)
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
        {option.sourceOptions.length > 0 && (
          <>
            <DialogActorSelect
              open={open}
              onOpenChange={setOpen}
              disabled={disabled}
              options={option.sourceOptions}
              option={option}
              onOptionChange={(next) => {
                next.context = {
                  ...option.context,
                  sourceID: next.context.sourceID,
                }
                if (validateSingleTargetDialogOption(state, next)) {
                  resolveDialogOption(next)
                }
              }}
            />
            {!disabled && (
              <InputGroupAddon>
                <MdDoubleArrow />
              </InputGroupAddon>
            )}
          </>
        )}
        <InputGroupAddon>{option.text}</InputGroupAddon>
        {option.targetOptions.length > 0 && (
          <>
            {!disabled && (
              <InputGroupAddon>
                <MdDoubleArrow />
              </InputGroupAddon>
            )}

            <DialogActorSelect
              open={open}
              onOpenChange={setOpen}
              disabled={disabled}
              option={option}
              options={option.targetOptions}
              onOptionChange={(next) => {
                next.context = {
                  ...option.context,
                  targetIDs: next.context.targetIDs,
                }
                if (validateSingleTargetDialogOption(state, next)) {
                  resolveDialogOption(next)
                }
              }}
            />
          </>
        )}
        <InputGroupAddon className="hidden group-hover:block absolute right-3 opacity-50">
          (0/{option.action.targets.max(state, option.context)})
        </InputGroupAddon>
      </InputGroup>
    </Button>
  )
}

export { DialogOptionSingleTarget }
