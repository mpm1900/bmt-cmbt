import { ActorCombobox } from '@/components/crew/actor-combobox'
import { DialogCard } from '@/components/encounter/dialog-card'
import { BannerTitle } from '@/components/ui/banner-title'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ViewLayoutContent } from '@/components/view-layout'
import { useGameState } from '@/hooks/useGameState'
import { usePlayerID } from '@/hooks/usePlayer'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, UserPlus } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/crew')({
  component: RouteComponent,
})

function RouteComponent() {
  const playerID = usePlayerID()
  const state = useGameState((s) => s.state)
  const actors = state.actors.filter((a) => a.playerID === playerID)
  const [activeID, setActive] = useState(actors[0]?.ID)
  return (
    <div className="h-screen w-screen flex flex-col items-center overflow-hidden relative">
      <div className="absolute top-2 right-2">
        <Button asChild>
          <Link to="/">
            Begin <ArrowRight />
          </Link>
        </Button>
      </div>

      <ViewLayoutContent>
        <DialogCard>
          <div className="flex">
            <BannerTitle>Your Party</BannerTitle>
          </div>
          <CardContent className="flex flex-col gap-2">
            <div className="grid grid-cols-3 grid-rows-2 gap-2">
              {actors.map((a) => (
                <ActorCombobox
                  key={a.ID}
                  value={a.name}
                  active={a.ID === activeID}
                  onSelect={() => setActive(a.ID)}
                />
              ))}
              {actors.length <= 5 && (
                <Button variant="outline">
                  Add Party Member <UserPlus />
                </Button>
              )}
            </div>
            <Select>
              <SelectTrigger>
                class
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
            </Select>
            <Select>
              <SelectTrigger>
                pastime
                <SelectValue placeholder="Select Pastime" />
              </SelectTrigger>
            </Select>
            <Select>
              <SelectTrigger>
                weapon
                <SelectValue placeholder="Select Weapon" />
              </SelectTrigger>
            </Select>
          </CardContent>
        </DialogCard>
      </ViewLayoutContent>
    </div>
  )
}
