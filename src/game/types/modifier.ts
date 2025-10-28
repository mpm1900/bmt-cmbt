import type { Delta } from './delta'

type Modifier<A> = Delta<A> & {
  ID: string
  priority: number
}

export type { Modifier }
