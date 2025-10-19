import {
  Fireball,
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
      Deals fire damage to {FireballTargetCount} targets simultaneously.
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
      <span className="font-bold">{FireballDamage.power}</span>{' '}
      <span className="text-muted-foreground">@ {FireballTargetCount}</span>
    </div>
  ),
  Critical: () => <></>,
}

export { FireballRenderer }
