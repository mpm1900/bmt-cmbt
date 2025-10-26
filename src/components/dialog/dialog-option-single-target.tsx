import { useState, type ComponentProps } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import {
  type DialogOptionContextMeta,
  type SingleTargetDialogOption,
} from '@/game/types/dialog'
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
import { newContext } from '@/game/mutations'
import { ArrowRight } from 'lucide-react'
import { v4 } from 'uuid'
import { findActor } from '@/game/access'

function DialogOptionSingleTarget({
  className,
  index,
  ...props
}: Partial<ComponentProps<'div'>> & {
  index: number
  option: SingleTargetDialogOption<State, SActor>
}) {
  const state = useGameState((s) => s.state)
  const { playerID } = useGameUI((s) => s)
  const resolveDialogOption = useGameState((s) => s.resolveDialogOption)
  const [context, setContext] = useState({
    ...newContext({ playerID }),
    text: '',
    ID: v4(),
  })
  const option = withContext(props.option, context)
  const disabled = !option.action.validate(state, context)
  const source = findActor(state, context.sourceID)
  const target = findActor(state, context.targetIDs[0])
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
              placeholder={<>Source</>}
              options={option.sourceOptions}
              value={{
                ...context,
                text: source?.name ?? context.text,
              }}
              onValueChange={(c) =>
                setContext({
                  ...context,
                  ID: c.ID,
                  sourceID: c.sourceID,
                })
              }
            />

            <InputGroupAddon>
              <MdDoubleArrow />
            </InputGroupAddon>
          </>
        )}

        <InputGroupAddon>{option.text}</InputGroupAddon>

        {option.targetOptions.length > 0 && (
          <>
            <InputGroupAddon>
              <MdDoubleArrow />
            </InputGroupAddon>

            <DialogActorSelect
              disabled={disabled}
              placeholder={<>Target</>}
              options={option.targetOptions}
              value={{
                ...context,
                text: target?.name ?? context.text,
              }}
              onValueChange={(c) =>
                setContext({
                  ...context,
                  ID: c.ID,
                  targetIDs: c.targetIDs,
                })
              }
            />
          </>
        )}

        {validateSingleTargetDialogOption(state, option) && !disabled && (
          <InputGroupAddon className="pl-8 absolute right-3">
            <InputGroupButton
              size="xs"
              variant="default"
              className="cursor-pointer"
              onClick={() => {
                resolveDialogOption(option)
                setContext(
                  newContext<DialogOptionContextMeta>({
                    playerID,
                    text: '',
                    ID: '',
                  })
                )
              }}
            >
              Confirm
              <ArrowRight />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    </Button>
  )
}

export { DialogOptionSingleTarget }
