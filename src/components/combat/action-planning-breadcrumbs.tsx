import { ChevronDown, Slash } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import type { SAction, SActor } from '@/game/state'
import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'

function ActionPlanningBreadcrumbs({
  source,
  action,
}: {
  source: SActor
  action: SAction | undefined
}) {
  const actors = useGameState((s) =>
    s.state.actors.filter((a) => a.playerID === source.playerID)
  )
  const { set, view } = useGameUI((s) => s)
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5">
              {source.name} <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {actors.map((actor) => (
                <DropdownMenuItem
                  key={actor.ID}
                  onSelect={() => set({ activeActorID: actor.ID })}
                >
                  {actor.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 capitalize [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5">
              {view} <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onSelect={() => set({ view: 'items' })}>
                Items
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => set({ view: 'actions' })}>
                Actions
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => set({ view: 'switch' })}>
                Switch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>

        {action && (
          <>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>{action.name}</BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export { ActionPlanningBreadcrumbs }
