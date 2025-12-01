import type { ComponentType } from 'react'

type ActionRenderer = {
  actionID: string
  img: string
  Name: ComponentType
  Cost: ComponentType
  Body: ComponentType<{ active: boolean }>
}

export type { ActionRenderer }
