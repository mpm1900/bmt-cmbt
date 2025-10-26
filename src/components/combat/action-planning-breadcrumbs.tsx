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
import {
  findActor,
  getAliveActiveActors,
  nextAvailableAction,
} from '@/game/access'
import { newContext } from '@/game/mutations'
import { Swap } from '@/game/data/actions/_system/swap'
import { usePlayerID } from '@/hooks/usePlayer'

function ActionPlanningBreadcrumbs({
  source,
  action,
}: {
  source: SActor
  action: SAction | undefined
}) {
  const state = useGameState((s) => s.state)
  const { set, view, activeActorID } = useGameUI((s) => s)
  const playerID = usePlayerID()
  const active = findActor(state, activeActorID)
  const actors = getAliveActiveActors(
    state,
    newContext({ playerID }),
    (a) => a.ID !== activeActorID
  )
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
                  onSelect={() =>
                    set({
                      activeActorID: actor.ID,
                      activeActionID:
                        view === 'actions'
                          ? nextAvailableAction(actor, state)?.ID
                          : Swap.ID,
                    })
                  }
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
              <DropdownMenuItem
                onSelect={() =>
                  set({
                    view: 'actions',
                    activeActionID: nextAvailableAction(active, state)?.ID,
                  })
                }
              >
                Actions
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  set({ view: 'switch', activeActionID: Swap.ID })
                }
              >
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
