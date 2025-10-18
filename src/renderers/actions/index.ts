import type { ComponentType } from 'react'

type ActionRenderer = {
  actionID: string
  Name: ComponentType
  DescriptionShort: ComponentType
  Badges: ComponentType
}

export type { ActionRenderer }
