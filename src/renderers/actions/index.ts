import type { ComponentType } from 'react'

type ActionRenderer = {
  actionID: string
  Name: ComponentType
  Body: ComponentType
  Icon: ComponentType
  Stat: ComponentType
}

export type { ActionRenderer }
