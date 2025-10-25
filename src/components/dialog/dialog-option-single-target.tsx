import { useState, type ComponentProps } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import type { SingleTargetDialogOption } from '@/game/types/dialog'
import type { SActor, State } from '@/game/state'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from '../ui/input-group'
import { MdDoubleArrow } from 'react-icons/md'
import { useGameState } from '@/hooks/useGameState'
import { DialogActorSelect } from './dialog-actor-select'
import { validateSingleTargetDialogOption, withContext } from '@/game/dialog'
import { useGameUI } from '@/hooks/useGameUI'
import { findActor } from '@/game/access'
import { newContext } from '@/game/mutations'
import { ArrowRight } from 'lucide-react'

function DialogOptionSingleTarget({
  className,
  index,
  option,
  ...props
}: Partial<ComponentProps<'div'>> & {
  index: number
  option: SingleTargetDialogOption<State, SActor>
}) {
  const state = useGameState((s) => s.state)
  const { playerID } = useGameUI((s) => s)
  const resolveDialogOption = useGameState((s) => s.resolveDialogOption)
  const [context, setContext] = useState(newContext({ playerID }))
  option = withContext(option, context)
  console.log(option)
  const disabled = !option.action.validate(state, context)
  return (
    <Button asChild size="sm">
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
              disabled={disabled}
              placeholder={<>Select Source</>}
              value={findActor(state, option.context.sourceID)?.name}
              options={option.sourceOptions}
              option={option}
              onOptionChange={(next) => {
                next = withContext(next, {
                  ...option.context,
                  sourceID: next.context.sourceID,
                })

                setContext(next.context)
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
              disabled={disabled}
              placeholder={<>Select Target</>}
              value={findActor(state, option.context.targetIDs[0])?.name}
              option={option}
              options={option.targetOptions}
              onOptionChange={(next) => {
                next = withContext(next, {
                  ...option.context,
                  targetIDs: next.context.targetIDs,
                })

                setContext(next.context)
              }}
            />
          </>
        )}
        {validateSingleTargetDialogOption(state, option) && !disabled && (
          <InputGroupAddon className="pl-8">
            <InputGroupButton
              size="xs"
              variant="default"
              className="cursor-pointer"
              onClick={() => {
                resolveDialogOption(option)
              }}
            >
              Confirm
              <ArrowRight />
            </InputGroupButton>
          </InputGroupAddon>
        )}
        <InputGroupAddon className="hidden group-hover:block absolute right-3 opacity-50">
          (0/{option.action.targets.max(state, option.context)})
        </InputGroupAddon>
      </InputGroup>
    </Button>
  )
}

export { DialogOptionSingleTarget }
