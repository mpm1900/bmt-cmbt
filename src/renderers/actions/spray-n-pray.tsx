import type { ActionRenderer } from '.'
import {
  SprayNPray,
  SprayNPrayAccuracy,
  SprayNPrayCooldown,
  SPrayNPrayCount,
  SprayNPrayCritChance,
  SprayNPrayDamage,
} from '@/game/data/actions/spray-n-pray'
import { ELEMENT_ICONS, MAIN_STAT_ICONS } from '../icons'
import { ActionSubDetails } from '@/components/tooltips/action-tooltip'

const ElementIcon = ELEMENT_ICONS[SprayNPrayDamage.element]
const StatIcon = MAIN_STAT_ICONS[SprayNPrayDamage.offenseStat]

const SprayNPrayRenderer: ActionRenderer = {
  actionID: SprayNPray.ID,
  Icon: () => <ElementIcon className="size-5" />,
  Name: () => <div className="">Spray 'n Pray</div>,
  Body: () => (
    <div className="flex flex-col gap-4">
      <ActionSubDetails
        accuracy={SprayNPrayAccuracy}
        critChance={SprayNPrayCritChance}
        damage={SprayNPrayDamage}
        cooldown={SprayNPrayCooldown}
      />
      <div>
        Deals{' '}
        <strong className="text-foreground">{SprayNPrayDamage.power}</strong>{' '}
        <strong className="text-foreground">{SprayNPrayDamage.element}</strong>{' '}
        damage to any other target{' '}
        <strong className="text-foreground">{SPrayNPrayCount}</strong> times.
        Testing out a much longer description name to see how the lines break,
        hopefully well.
        <div className="italic indent-4 pt-4 text-xs text-muted-foreground/80">
          "here is where I could put some lore, if I had some. but I want to see
          how the text looks on 2 lines."
        </div>
      </div>
    </div>
  ),
  Stat: () => <StatIcon className="size-4 text-reflexes" />,
}

export { SprayNPrayRenderer }
