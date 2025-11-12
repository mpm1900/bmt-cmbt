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
    <div className="flex justify-start gap-6 mb-3 px-6 w-full max-w-[1440px]">
      <PlayerActors player={player} current={current} />
      <div className="flex flex-col items-center justify-end gap-1">
        <ActorSelectorGrid playerID={player.ID} />
        <span className="text-lg font-bold text-slate-300/50 title h-5">
          Team
        </span>
      </div>
      <div className="flex flex-col items-center justify-end gap-1">
        <div className="flex items-baseline text-muted-foreground">
          <span className="text-2xl title">{player.credits}</span>
          <GiCreditsCurrency />
        </div>
        <span className=" font-bold text-lg text-slate-300/50 title h-5">
          Credits
        </span>
      </div>
    </div>
  )
}

export { Player }
