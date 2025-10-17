import { cn } from '@/lib/utils'
import { buttonVariants } from './ui/button'
import { Label } from './ui/label'
import { RadioGroupItem } from './ui/radio-group'
import type { SAction } from '@/game/state'
import { ACTION_RENDERERS } from '@/renderers'

function ActionRadioItem({ action }: { action: SAction }) {
  const renderer = ACTION_RENDERERS[action.ID]
  return (
    <Label
      key={action.ID}
      htmlFor={action.ID}
      className={cn(
        buttonVariants({ variant: 'outline' }),
        'items-start flex-col h-auto',
        'has-[[data-state=checked]]:[&_.action-description]:flex'
      )}
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value={action.ID} id={action.ID} className="peer" />
        <span className="peer-data-[state=unchecked]:text-muted-foreground">
          {renderer ? <renderer.Name /> : action.name}
        </span>
      </div>
      <div className="action-description pl-6 hidden">test</div>
    </Label>
  )
}

export { ActionRadioItem }
