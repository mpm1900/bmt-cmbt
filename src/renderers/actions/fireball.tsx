import {
  Fireball,
  FireballAccuracy,
  FireballCooldown,
  FireballDamage,
  FireballTargetCount,
} from '@/game/data/actions/fireball'
import type { ActionRenderer } from '.'
import { ELEMENT_ICONS, MAIN_STAT_ICONS } from '../icons'
import { ActionSubDetails } from '@/components/tooltips/action-tooltip'
import img from '@/assets/spells/Fire Spell Pack25.png'

const ElementIcon = ELEMENT_ICONS[FireballDamage.element]
const OStatIcon = MAIN_STAT_ICONS[FireballDamage.offenseStat]

const FireballRenderer: ActionRenderer = {
  actionID: Fireball.ID,
  img,
  Icon: () => <ElementIcon className="size-5 text-fire" />,
  Name: () => <div className="">Fireball</div>,
  Body: () => (
    <div className="flex flex-col gap-1">
      <ActionSubDetails accuracy={FireballAccuracy} damage={FireballDamage} />
      <div className="p-2">
        Deals{' '}
        <strong className="text-foreground">{FireballDamage.power}</strong>{' '}
        <strong className="text-fire">fire</strong> damage to up to{' '}
        <strong className="text-foreground">{FireballTargetCount}</strong>{' '}
        target enemies simul. {FireballCooldown} turn cooldown.
      </div>
    </div>
  ),
  Stat: () => <OStatIcon className="size-4 text-mind" />,
}

export { FireballRenderer }
