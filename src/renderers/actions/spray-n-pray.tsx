import type { ActionRenderer } from '.'
import {
  SprayNPray,
  SprayNPrayAccuracy,
  SPrayNPrayCount,
  SprayNPrayCritChance,
  SprayNPrayDamage,
} from '@/game/data/actions/spray-n-pray'
import { ELEMENT_ICONS, MAIN_STAT_ICONS } from '../icons'

const ElementIcon = ELEMENT_ICONS[SprayNPrayDamage.element]
const StatIcon = MAIN_STAT_ICONS[SprayNPrayDamage.offenseStat]

const SprayNPrayRenderer: ActionRenderer = {
  actionID: SprayNPray.ID,
  Name: () => <div className="">Spray 'n Pray</div>,
  DescriptionShort: () => (
    <div>
      Deals {SprayNPrayDamage.element} damage {SPrayNPrayCount} times. Testing
      out a much longer description name to see how the lines break, hopefully
      well.
    </div>
  ),
  Icons: () => (
    <div className="flex gap-2 items-center">
      <ElementIcon className="size-5" />
      <StatIcon className="size-5" />
    </div>
  ),
  Damage: () => (
    <div>
      <span>
        (<span className="font-bold">{SprayNPrayDamage.power}</span>{' '}
        <span className="text-muted-foreground"></span>x {SPrayNPrayCount}){' '}
        {SprayNPrayAccuracy}%
      </span>
    </div>
  ),
  /*
  Critical: () => (
    <div>
      <span className="text-muted-foreground/80 text-xs">
        (x{SprayNPrayDamage.criticalModifier * 100}%) {SprayNPrayCritChance}%
      </span>
    </div>
  ),*/
}

export { SprayNPrayRenderer }
