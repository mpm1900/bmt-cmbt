import type { Element, MainStat } from '@/game/types/actor'
import {
  GiBrainStem,
  GiFlamer,
  GiGooeyImpact,
  GiPowerLightning,
} from 'react-icons/gi'
import { LuBrain, LuBicepsFlexed } from 'react-icons/lu'
import type { IconType } from 'react-icons/lib'
import { PiHandEyeFill } from 'react-icons/pi'

const ELEMENT_ICONS: Record<Element, IconType> = {
  fire: GiFlamer,
  physical: GiGooeyImpact,
  psy: GiBrainStem,
  shock: GiPowerLightning,
}

const MAIN_STAT_ICONS: Record<MainStat, IconType> = {
  body: LuBicepsFlexed,
  mind: LuBrain,
  //reflexes: FaGun,
  reflexes: PiHandEyeFill,
}

export { ELEMENT_ICONS, MAIN_STAT_ICONS }
