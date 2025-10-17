import { Fireball } from '@/game/data/actions/fireball'
import type { ActionRenderer } from '.'

const FireballRenderer: ActionRenderer = {
  actionID: Fireball.ID,
  Name: () => <div className="text-orange-400">Fireball</div>,
  DescriptionShort: () => <div>Fireball</div>,
}

export { FireballRenderer }
