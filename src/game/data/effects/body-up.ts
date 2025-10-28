import type { SEffect } from '@/game/state'
import { v4 } from 'uuid'
import { UpdateStat } from './update-stat'

const BodyUp: SEffect = {
  ...UpdateStat((a) => ({
    body: Math.round(a.stats.body * 1.5),
  })),
  ID: v4(),
  name: 'Body Up',
}

export { BodyUp }
