import { cn } from '@/lib/utils'
import { buttonVariants } from '../ui/button'
import { Label } from '../ui/label'
import { RadioGroupItem } from '../ui/radio-group'
import type { SAction } from '@/game/state'
import { ACTION_RENDERERS } from '@/renderers'
import { Item, ItemActions, ItemContent } from '../ui/item'

function ActionRadioItem({ action }: { action: SAction }) {
  const renderer = ACTION_RENDERERS[action.ID]
  return (
    <Item asChild>
      <Label
        htmlFor={action.ID}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'items-start h-auto',
          'has-[[data-state=checked]]:[&_.action-description]:flex'
        )}
      >
        <ItemContent>
          <div className="flex items-center gap-2">
            <RadioGroupItem value={action.ID} id={action.ID} className="peer" />
            <span className="peer-data-[state=unchecked]:text-muted-foreground">
              {renderer ? <renderer.Name /> : action.name}
            </span>
          </div>
          {renderer && (
            <div className="action-description pl-6 hidden text-muted-foreground">
              <renderer.DescriptionShort />
            </div>
          )}
        </ItemContent>
        {renderer && (
          <ItemActions>
            <renderer.Badges />
          </ItemActions>
        )}
      </Label>
    </Item>
  )
}

export { ActionRadioItem }
