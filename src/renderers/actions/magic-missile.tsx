import type { ActionRenderer } from '.'
import {
  MagicMissile,
  MagicMissileAccuracy,
  MagicMissileCritChance,
  MagicMissileDamage,
} from '@/game/data/actions/magic-missile'
import { Brain } from 'lucide-react'
import { ELEMENT_ICONS } from '../icons'

const ElementIcon = ELEMENT_ICONS[MagicMissileDamage.element]
const MagicMissileRenderer: ActionRenderer = {
  actionID: MagicMissile.ID,
  Name: () => <div className="">Magic Missile</div>,
  DescriptionShort: () => (
    <div>
      Deals shock damage 5 times. Testing out a much longer description name to
      see how lines break, hopefully well.
    </div>
  ),
  Icons: () => (
    <div className="flex gap-2 items-center">
      <ElementIcon className="size-5" />
      <Brain className="size-5" />
    </div>
  ),
  Damage: () => (
    <div>
      <span>
        (<span className="font-bold">{MagicMissileDamage.power}</span>{' '}
        <span className="text-muted-foreground"></span>x 5){' '}
        {MagicMissileAccuracy}%
      </span>
    </div>
  ),
  Critical: () => (
    <div>
      <span className="text-muted-foreground/80 text-xs">
        (x{MagicMissileDamage.criticalModifier * 100}%) {MagicMissileCritChance}
        %
      </span>
    </div>
  ),
}

export { MagicMissileRenderer }
