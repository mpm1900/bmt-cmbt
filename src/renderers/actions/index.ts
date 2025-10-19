import type { ComponentType } from 'react'

type ActionRenderer = {
  actionID: string
  Name: ComponentType
  DescriptionShort: ComponentType
  Icons: ComponentType
  Damage: ComponentType
}

export type { ActionRenderer }
