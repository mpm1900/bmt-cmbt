import type { Player as PlayerType } from '@/game/types/player'
import { ViewSelector } from '../view-selector'
import { ActorSelectorGrid } from './actor-selector-grid'
import { PlayerActors } from './player-actors'

function Player({ player }: { player: PlayerType }) {
  return (
    <div className="flex justify-start gap-2 m-2">
      <PlayerActors player={player} />
      <div className="flex flex-col items-center justify-end px-4 gap-1">
        <ViewSelector />
        <span className="uppercase font-bold text-xs text-muted-foreground">
          Views
        </span>
      </div>
      <div className="flex flex-col items-center justify-end px-4 gap-1">
        <ActorSelectorGrid playerID={player.ID} />
        <span className="uppercase font-bold text-xs text-muted-foreground">
          Team
        </span>
      </div>
    </div>
  )
}

export { Player }
