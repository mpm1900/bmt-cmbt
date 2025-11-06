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
      Deals{' '}
      <strong className="text-foreground">{SprayNPrayDamage.power}</strong>{' '}
      power of{' '}
      <strong className="text-foreground">{SprayNPrayDamage.element}</strong>{' '}
      damage to any other target{' '}
      <strong className="text-foreground">{SPrayNPrayCount}</strong> times.
      Testing out a much longer description name to see how the lines break,
      hopefully well.
    </div>
  ),
  Icons: () => (
    <div className="flex gap-2 items-center">
      <ElementIcon className="size-5" />
      <StatIcon className="size-5" />
    </div>
  ),
  Accuracy: () => `${SprayNPrayAccuracy}%`,
  Critical: () => (
    <div className="text-end">
      <div>{SprayNPrayCritChance}%</div>
      {/*<div className="text-xs">{SprayNPrayDamage.criticalModifier * 100}%</div>*/}
    </div>
  ),
}

export { SprayNPrayRenderer }
