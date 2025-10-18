import type { Queue } from './types/queue'

function enqueue<T>(queue: Queue<T>, ...items: Array<T>): Queue<T> {
  return [...queue, ...items]
}

function push<T>(queue: Queue<T>, items: Array<T>): Queue<T> {
  return [...items, ...queue]
}

function pop<T>(queue: Queue<T>): Queue<T> {
  const [_, ...next] = queue
  return next
}

function sort<T>(queue: Queue<T>, compareFn: (a: T, b: T) => number): Queue<T> {
  return queue.sort(compareFn)
}

export { enqueue, push, pop, sort }
