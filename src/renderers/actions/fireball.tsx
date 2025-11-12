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

const ElementIcon = ELEMENT_ICONS[FireballDamage.element]
const OStatIcon = MAIN_STAT_ICONS[FireballDamage.offenseStat]

const FireballRenderer: ActionRenderer = {
  actionID: Fireball.ID,
  Icon: () => <ElementIcon className="size-5 text-fire" />,
  Name: () => <div className="">Fireball</div>,
  Body: () => (
    <div className="flex flex-col gap-2">
      <div>
        Deals{' '}
        <strong className="text-foreground">{FireballDamage.power}</strong>{' '}
        <strong className="text-fire">fire</strong> damage to up to{' '}
        <strong className="text-foreground">{FireballTargetCount}</strong>{' '}
        target enemies simultaneously.
      </div>
      <ActionSubDetails
        accuracy={FireballAccuracy}
        cooldown={FireballCooldown}
        damage={FireballDamage}
      />
    </div>
  ),
  Stat: () => <OStatIcon className="size-4 text-mind" />,
}

export { FireballRenderer }
