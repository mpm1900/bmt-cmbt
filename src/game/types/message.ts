import type { ReactNode } from 'react'
import type { DeltaContext } from './delta'

type MessageType = 'narration' | 'action' | 'dialogue'

type Message = {
  ID: string
  context: DeltaContext
  text: ReactNode
  depth: number
  type: MessageType
}

export type { Message }
