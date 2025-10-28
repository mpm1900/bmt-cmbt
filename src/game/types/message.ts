import type { ReactNode } from 'react'
import type { DeltaContext } from './delta'

type Message = {
  ID: string
  context: DeltaContext
  text: ReactNode
  depth: number
}

export type { Message }
