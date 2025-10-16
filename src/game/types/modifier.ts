import type { Delta } from './delta'

type Modifier<A> = Delta<A> & {
  ID: string
  delay: number
  duration: number | undefined
  priority: number
}

export type { Modifier }
