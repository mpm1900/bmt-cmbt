import type { Element, MainStat } from '@/game/types/actor'
import {
  GiBrainStem,
  GiChaliceDrops,
  GiFlamer,
  GiGooeyImpact,
  GiPowerLightning,
  GiSprint,
} from 'react-icons/gi'
import { LuBrain, LuBicepsFlexed } from 'react-icons/lu'
import type { IconType } from 'react-icons/lib'

const ELEMENT_ICONS: Record<Element, IconType> = {
  fire: GiFlamer,
  physical: GiGooeyImpact,
  psy: GiBrainStem,
  shock: GiPowerLightning,
}

const MAIN_STAT_ICONS: Record<MainStat, IconType> = {
  strength: LuBicepsFlexed,
  faith: GiChaliceDrops,
  intelligence: LuBrain,
  speed: GiSprint,
}

export { ELEMENT_ICONS, MAIN_STAT_ICONS }
