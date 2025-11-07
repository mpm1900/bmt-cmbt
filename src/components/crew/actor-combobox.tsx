import { ChevronDown, Trash } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../ui/input-group'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Separator } from '../ui/separator'

function ActorCombobox({
  active,
  onSelect,
  ...props
}: ComponentProps<typeof InputGroupInput> & {
  active: boolean
  onSelect: () => void
}) {
  return (
    <InputGroup
      className={cn('group', {
        'bg-input! border-ring cursor-default [&_*]:cursor-default': active,
      })}
      onClick={() => onSelect()}
    >
      <div className="flex items-center gap-1 pr-1!">
        <InputGroupAddon>
          <RadioGroup value={active ? 'selected' : ''}>
            <RadioGroupItem value="selected" />
          </RadioGroup>
        </InputGroupAddon>
        <InputGroupButton className={cn('text-muted-foreground')}>
          Class <ChevronDown />
        </InputGroupButton>
      </div>
      <Separator orientation="vertical" />
      <InputGroupInput {...props} />
      <InputGroupButton
        className="opacity-0 group-hover:opacity-100 mr-1"
        size="icon-xs"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Trash />
      </InputGroupButton>
    </InputGroup>
  )
}

export { ActorCombobox }
