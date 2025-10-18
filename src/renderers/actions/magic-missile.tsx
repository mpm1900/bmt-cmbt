import type { ActionRenderer } from '.'
import {
  MagicMissile,
  MagicMissileDamage,
} from '@/game/data/actions/magic-missile'
import { Brain } from 'lucide-react'
import { ELEMENT_ICONS } from '../icons'

const ElementIcon = ELEMENT_ICONS[MagicMissileDamage.element]
const MagicMissileRenderer: ActionRenderer = {
  actionID: MagicMissile.ID,
  Name: () => <div className="">Magic Missile</div>,
  DescriptionShort: () => <div>Deals shock damage 5 times.</div>,
  Badges: () => (
    <div className="flex gap-2 items-center">
      <div>
        <span className="font-bold">{MagicMissileDamage.power}</span>{' '}
        <span className="text-muted-foreground">x 5</span>
      </div>
      <ElementIcon className="size-5" />
      <Brain className="size-5" />
    </div>
  ),
}

export { MagicMissileRenderer }
