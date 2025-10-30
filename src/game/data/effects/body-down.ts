import type { SEffect } from '@/game/state'
import { v4 } from 'uuid'
import { UpdateStat } from './update-stat'

const BodyDown: SEffect = {
  ...UpdateStat((a) => ({
    body: Math.round(a.stats.body - a.stats.body * 0.5),
  })),
  ID: v4(),
  name: 'Body Down',
}

export { BodyDown }
