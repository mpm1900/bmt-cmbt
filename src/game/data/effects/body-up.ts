import type { SEffect } from '@/game/state'
import { v4 } from 'uuid'
import { UpdateStat } from './update-stat'

const BodyUp: SEffect = {
  ...UpdateStat((a) => ({
    strength: Math.round(a.stats.strength + a.stats.strength * 0.5),
  })),
  ID: v4(),
  name: 'Strength Up',
}

export { BodyUp }
