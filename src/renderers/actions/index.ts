import type { ComponentType } from 'react'

type ActionRenderer = {
  actionID: string
  img: string
  Name: ComponentType
  Body: ComponentType
  Icon: ComponentType
  Stat: ComponentType
}

export type { ActionRenderer }
