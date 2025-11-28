import { ChevronDown, Grip, Trash } from 'lucide-react'
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from '../ui/input-group'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
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
      className={cn('group ring ring-black', {
        'bg-input! border-ring cursor-default [&_*]:cursor-default': active,
      })}
      onClick={() => onSelect()}
    >
      <div className="flex items-center gap-1 pr-1!">
        <InputGroupButton className="ml-2 cursor-pointer">
          <Grip />
        </InputGroupButton>
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
        <Trash className={cn('text-muted-foreground')} />
      </InputGroupButton>
    </InputGroup>
  )
}

export { ActorCombobox }
