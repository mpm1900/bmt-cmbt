import type { ReactNode } from 'react'
import type { DeltaContext } from './delta'

type Message = {
  ID: string
  context: DeltaContext
  text: ReactNode
}

export type { Message }
