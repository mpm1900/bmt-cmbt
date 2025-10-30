import type { Element, MainStat } from '@/game/types/actor'
import {
  GiBrainStem,
  GiFlamer,
  GiGooeyImpact,
  GiPowerLightning,
} from 'react-icons/gi'
import { LuBrain, LuBicepsFlexed } from 'react-icons/lu'
import { FaGun } from 'react-icons/fa6'
import type { IconType } from 'react-icons/lib'

const ELEMENT_ICONS: Record<Element, IconType> = {
  fire: GiFlamer,
  physical: GiGooeyImpact,
  psy: GiBrainStem,
  shock: GiPowerLightning,
}

const MAIN_STAT_ICONS: Record<MainStat, IconType> = {
  body: LuBicepsFlexed,
  mind: LuBrain,
  reflexes: FaGun,
}

export { ELEMENT_ICONS, MAIN_STAT_ICONS }
