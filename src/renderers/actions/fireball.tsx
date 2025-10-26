import {
  Fireball,
  FireballAccuracy,
  FireballDamage,
  FireballTargetCount,
} from '@/game/data/actions/fireball'
import type { ActionRenderer } from '.'
import { ELEMENT_ICONS, MAIN_STAT_ICONS } from '../icons'

const ElementIcon = ELEMENT_ICONS[FireballDamage.element]
const StatIcon = MAIN_STAT_ICONS[FireballDamage.offenseStat]

const FireballRenderer: ActionRenderer = {
  actionID: Fireball.ID,
  Name: () => <div className="">Fireball</div>,
  DescriptionShort: () => (
    <div>
      Deals <strong className="text-foreground">{FireballDamage.power}</strong>{' '}
      power of <strong className="text-orange-300">fire</strong> damage to{' '}
      <strong className="text-foreground">{FireballTargetCount}</strong> targets
      simultaneously.
    </div>
  ),
  Icons: () => (
    <div className="flex gap-2 items-center">
      <ElementIcon className="size-5" />
      <StatIcon className="size-5" />
    </div>
  ),
  Accuracy: () => `${FireballAccuracy}%`,
  Critical: () => `0%`,
}

export { FireballRenderer }
