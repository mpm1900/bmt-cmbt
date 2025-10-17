import { ActionContextGenerator } from '@/components/action-context-generator'
import { Actor } from '@/components/actor'
import { PhaseController } from '@/components/phase-controller'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button, buttonVariants } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { withEffects } from '@/game/actor'
import { BrainBlast } from '@/game/data/actions/brain-blast'
import { DragonDance } from '@/game/data/actions/dragon-dance'
import { Fireball } from '@/game/data/actions/fireball'
import { Heal } from '@/game/data/actions/heal'
import { MagicMissile } from '@/game/data/actions/magic-missile'
import { useGameState } from '@/hooks/useGameState'
import { useGameUI } from '@/hooks/useGameUI'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowDownUp,
  Box,
  ChevronDown,
  FoldVertical,
  Slash,
} from 'lucide-react'

export const Route = createFileRoute('/battle')({
  component: RouteComponent,
})

const actions = [Fireball, MagicMissile, BrainBlast, Heal, DragonDance]

function RouteComponent() {
  const { state, pushAction, next } = useGameState((store) => store)
  const actors = state.actors.map((actor) => withEffects(actor, state.effects))
  const { activeActionID, activeActorID, set: setUI } = useGameUI((s) => s)
  const activeActor = actors.find((actor) => actor[0].ID === activeActorID)?.[0]
  const activeAction = actions.find((action) => action.ID === activeActionID)

  // bg-[url('./public/platforms.jpg')]
  return (
    <div className="h-screen w-screen flex flex-col items-between  bg-cover bg-no-repeat">
      <PhaseController />
      <div>
        <div>Phase: {state.turn.phase}</div>
        <div>Actions: {state.actionQueue.queue.length}</div>
        <div>Triggers: {state.triggerQueue.queue.length}</div>
        <div>Mutations: {state.mutationQueue.queue.length}</div>
        <Button onClick={next}>Next</Button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        {activeActor && state.turn.phase === 'planning' && (
          <Card className="min-w-200 w-full max-w-[70%]">
            <CardHeader>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5">
                        Actions <ChevronDown />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem>Items</DropdownMenuItem>
                        <DropdownMenuItem>Actions</DropdownMenuItem>
                        <DropdownMenuItem>Switch</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <Slash />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5">
                        {activeActor.name} <ChevronDown />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {actors.map(([actor]) => (
                          <DropdownMenuItem key={actor.ID}>
                            {actor.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </BreadcrumbItem>

                  {activeAction && (
                    <>
                      <BreadcrumbSeparator>
                        <Slash />
                      </BreadcrumbSeparator>
                      <BreadcrumbItem>{activeAction?.name}</BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <ScrollArea className="h-64 pr-4">
                <RadioGroup
                  value={activeActionID ?? null}
                  onValueChange={(value) => setUI({ activeActionID: value })}
                >
                  {actions.map((action) => (
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
                        <RadioGroupItem
                          value={action.ID}
                          id={action.ID}
                          className="peer"
                        />
                        <span className="peer-data-[state=unchecked]:text-muted-foreground">
                          {action.name}
                        </span>
                      </div>
                      <div className="action-description pl-6 hidden">test</div>
                    </Label>
                  ))}
                </RadioGroup>
              </ScrollArea>
              {activeAction && activeActorID && (
                <ScrollArea className="h-64">
                  <ActionContextGenerator
                    action={activeAction}
                    sourceID={activeActorID}
                    onContextConfirm={(context) => {
                      pushAction(activeAction, context)
                    }}
                  />
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <div className="flex justify-start gap-2 my-2">
        <div className="flex items-end p-4">
          <ButtonGroup>
            <Button variant="secondary" size="icon-lg">
              <Box />
            </Button>
            <ButtonGroupSeparator />
            <Button variant="default" size="icon-lg">
              <FoldVertical />
            </Button>
            <ButtonGroupSeparator />
            <Button variant="secondary" size="icon-lg">
              <ArrowDownUp />
            </Button>
          </ButtonGroup>
        </div>
        <div className="flex self-center justify-self-center justify-center gap-2 my-2">
          {actors.map(([actor, effects]) => (
            <Actor
              key={actor.ID}
              actor={actor}
              effects={effects}
              active={activeActorID === actor.ID}
              disabled={state.turn.phase !== 'planning'}
              onClick={() => {
                setUI({
                  activeActionID: undefined,
                  activeActorID: actor.ID,
                })
              }}
            />
          ))}
        </div>
        <div className="w-54">other stuff</div>
      </div>
    </div>
  )
}
