import type { Element } from '@/game/types/actor'
import {
  GiBrainStem,
  GiFlamer,
  GiGooeyImpact,
  GiPowerLightning,
} from 'react-icons/gi'
import type { IconType } from 'react-icons/lib'

const ELEMENT_ICONS: Record<Element, IconType> = {
  fire: GiFlamer,
  physical: GiGooeyImpact,
  psy: GiBrainStem,
  shock: GiPowerLightning,
}

export { ELEMENT_ICONS }
