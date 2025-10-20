import type { Delta } from './delta'

type Modifier<A> = Delta<A> & {
  ID: string
}

export type { Modifier }
