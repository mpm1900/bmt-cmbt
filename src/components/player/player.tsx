import type { SActionItem, SPlayer } from '@/game/state'
import { PlayerActors } from './player-actors'
import { CombatLog } from '../combat/combat-log'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { RiTeamFill } from 'react-icons/ri'
import { BsBackpack4Fill } from 'react-icons/bs'
import { useGameState } from '@/hooks/useGameState'
import { Button } from '../ui/button'
import { isActive } from '@/game/access'
import { cn } from '@/lib/utils'
import {
  TbHexagon,
  TbHexagonOff,
  TbHexagonFilled,
  TbHexagonNumber1Filled,
  TbHexagonNumber2Filled,
  TbHexagonNumber3Filled,
  TbSwords,
} from 'react-icons/tb'
import { getPosition } from '@/game/player'
import { Dialog } from '@radix-ui/react-dialog'
import { DialogTrigger } from '../ui/dialog'
import { ActorDialog } from './actor-dialog'
import { PlayerItemsDialog } from './player-items-dialog'
import { useGameUI } from '@/hooks/useGameUI'
import { Separator } from '../ui/separator'
import { useState } from 'react'

const numbers = [
  TbHexagonNumber1Filled,
  TbHexagonNumber2Filled,
  TbHexagonNumber3Filled,
]

function Player({
  player,
  current,
}: {
  player: SPlayer
  current: SActionItem | undefined
}) {
  const { state } = useGameState((s) => s)
  const { activePlayerTab, set } = useGameUI((s) => s)
  const actors = state.actors.filter((actor) => actor.playerID === player.ID)
  const [itemsOpen, setItemOpen] = useState(false)

  return (
    <div className="flex justify-start gap-6 mb-3 w-full max-w-[1440px]">
      <div>
        <PlayerActors player={player} current={current} />
        <div className="flex items-center justify-center text-center title text-lg h-5 leading-5 text-muted-foreground gap-6 px-3 mt-1">
          <Separator className="flex-1" />
          Active Party
          <Separator className="flex-1" />
        </div>
      </div>
      <Tabs
        orientation="vertical"
        className="flex-row items-center rounded-xs gap-1"
        value={activePlayerTab}
        onValueChange={(value) =>
          set({ activePlayerTab: value as typeof activePlayerTab })
        }
      >
        <TabsList className="flex flex-col items-center justify-around bg-transparent h-full gap-2 z-10">
          <TabsTrigger
            value="combat-log"
            className="bg-muted rounded-sm ring border !border-foreground/10 ring-black hover:bg-ring dark:data-[state=active]:bg-ring"
          >
            <TbSwords />
          </TabsTrigger>
          <TabsTrigger
            value="party"
            className="bg-muted rounded-sm ring border !border-foreground/10 ring-black hover:bg-ring dark:data-[state=active]:bg-ring"
          >
            <RiTeamFill />
          </TabsTrigger>
          <div className="flex-1" />
          <Dialog open={itemsOpen} onOpenChange={setItemOpen}>
            <DialogTrigger className="px-2 py-1.5 bg-muted text-muted-foreground rounded-sm ring border !border-foreground/10 ring-black hover:bg-ring/50">
              <BsBackpack4Fill />
            </DialogTrigger>
            <PlayerItemsDialog open={itemsOpen} onOpenChange={setItemOpen} />
          </Dialog>
        </TabsList>
        <div className="relative h-32 w-62 xl:w-80">
          <TabsContent value="combat-log" className="h-full">
            <CombatLog className="h-full w-full rounded-xs p-2 bg-black/90 border ring ring-black text-xs" />
          </TabsContent>
          <TabsContent value="party" className="h-full">
            <div className="grid grid-cols-2 grid-rows-3 h-full gap-1">
              {actors.map((a) => {
                const active = isActive(state, a.ID)
                const position = getPosition(state, a.ID)
                const Icon = numbers[position?.index ?? -1] ?? TbHexagonFilled

                return (
                  <Dialog key={a.ID}>
                    <DialogTrigger asChild>
                      <Button
                        className={cn(
                          '!rounded-sm justify-baseline',
                          'opacity-100 hover:opacity-90 h-full'
                        )}
                        variant={a.state.alive ? 'slate' : 'destructive'}
                      >
                        {active ? (
                          <Icon />
                        ) : a.state.alive ? (
                          <TbHexagon />
                        ) : (
                          <TbHexagonOff />
                        )}
                        <div className="text-left">
                          <div className="-mb-1 font-semibold">{a.name}</div>
                          <div className="-mt-1 text-foreground/40 text-xs">
                            {a.class?.name ?? 'N/A'}
                          </div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <ActorDialog actor={a} />
                  </Dialog>
                )
              })}
              {Array.from({ length: 6 - actors.length }).map((_, i) => (
                <div key={i} className="h-full w-full bg-black/20"></div>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export { Player }
