import { Fireball, FireballDamage } from '@/game/data/actions/fireball'
import type { ActionRenderer } from '.'
import { Brain } from 'lucide-react'
import { ELEMENT_ICONS } from '../icons'

const ElementIcon = ELEMENT_ICONS[FireballDamage.element]

const FireballRenderer: ActionRenderer = {
  actionID: Fireball.ID,
  Name: () => <div className="">Fireball</div>,
  DescriptionShort: () => <div>Deals fire damage to a single target.</div>,
  Badges: () => (
    <div className="flex gap-2 items-center">
      <div>
        <span className="font-bold">{FireballDamage.power}</span>{' '}
        <span className="text-muted-foreground">@ 1</span>
      </div>
      <ElementIcon className="size-5" />
      <Brain className="size-5" />
    </div>
  ),
}

export { FireballRenderer }
