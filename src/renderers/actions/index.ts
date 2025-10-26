import type { ComponentType } from 'react'

type ActionRenderer = {
  actionID: string
  Name: ComponentType
  DescriptionShort: ComponentType
  Icons: ComponentType
  Damage?: ComponentType
  Critical?: ComponentType
}

export type { ActionRenderer }
