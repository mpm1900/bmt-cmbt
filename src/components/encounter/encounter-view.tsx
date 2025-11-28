import { useGameState } from '@/hooks/useGameState'
import { useEffect } from 'react'
import { ViewLayoutContent } from '../view-layout'
import { DialogNode } from './dialog-node'
import { EncounterController } from './encounter-controller'
import { DialogCard } from './dialog-card'
import { CardAction } from '../ui/card'
import { hasNext } from '@/game/next'
import { AnimatePresence } from 'motion/react'
import { Button } from '../ui/button'
import { BannerTitle } from '../ui/banner-title'
import bg from '@/assets/Devastated Landscape1.png'

function EncounterView() {
  const { state } = useGameState((s) => s)
  const phase = state.combat?.phase
  const planning = phase === 'planning'
  const running = !planning && hasNext(state)
  const pastEncounters = Object.values(state.pastEncounters).filter(
    (e) => e.ID !== state.encounter.ID
  )
  useEffect(() => {}, [state])

  return (
    <>
      <EncounterController />
      <ViewLayoutContent>
        <AnimatePresence mode="wait" onExitComplete={() => {}}>
          <DialogCard
            key={state.encounter.ID}
            className="gap-0 relative"
            style={{
              imageRendering: 'pixelated',
              backgroundImage: `url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'bottom',
            }}
          >
            <div
              className="absolute inset-0 z-0"
              style={{
                background:
                  'linear-gradient(0deg,rgba(0, 0, 0, 0.95) 33%, rgba(0, 0, 0, 0.99) 100%)',
              }}
            />
            <div className="flex items-start justify-between">
              <BannerTitle>{state.encounter.name}</BannerTitle>
              <CardAction className="absolute top-2 right-2 z-30">
                {pastEncounters.length > 0 && (
                  <Button variant="ghost" disabled={running}>
                    <span className="text-muted-foreground">Travel</span>
                  </Button>
                )}
              </CardAction>
            </div>
            <DialogNode />
          </DialogCard>
        </AnimatePresence>
      </ViewLayoutContent>
    </>
  )
}

export { EncounterView }
