import type { SActionItem, SPlayer } from '@/game/state'
import { ActorSelectorGrid } from './actor-selector-grid'
import { PlayerActors } from './player-actors'
import { GiCreditsCurrency } from 'react-icons/gi'

function Player({
  player,
  current,
}: {
  player: SPlayer
  current: SActionItem | undefined
}) {
  return (
    <div className="flex justify-start gap-6 mb-3 mx-6">
      <PlayerActors player={player} current={current} />
      <div className="flex flex-col items-center justify-end gap-1">
        <ActorSelectorGrid playerID={player.ID} />
        <span className="uppercase font-bold text-xs text-slate-300/50">
          Team
        </span>
      </div>
      <div className="flex flex-col items-center justify-end gap-1">
        <div className="flex items-center text-muted-foreground">
          {player.credits}
          <GiCreditsCurrency />
        </div>
        <span className="uppercase font-bold text-xs text-slate-300/50">
          Credits
        </span>
      </div>
    </div>
  )
}

export { Player }
