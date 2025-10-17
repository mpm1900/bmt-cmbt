import type { Queue } from './types/queue'

function newQueue<T>(initial: Array<T> = []): Queue<T> {
  return {
    queue: initial,
    active: undefined,
  }
}

function clearActive<T>(queue: Queue<T>): Queue<T> {
  return {
    ...queue,
    active: undefined,
  }
}

function enqueueItems<T>(queue: Queue<T>, ...items: Array<T>): Queue<T> {
  return {
    ...queue,
    queue: [...queue.queue, ...items],
  }
}

function pushItems<T>(queue: Queue<T>, items: Array<T>): Queue<T> {
  return {
    ...queue,
    queue: [...items, ...queue.queue],
  }
}

function popItem<T>(queue: Queue<T>): Queue<T> {
  const [item, ...next] = queue.queue
  return {
    ...queue,
    queue: next,
    active: item,
  }
}

function sort<T>(queue: Queue<T>, compareFn: (a: T, b: T) => number): Queue<T> {
  return {
    ...queue,
    queue: queue.queue.sort(compareFn),
  }
}

export { newQueue, clearActive, enqueueItems, pushItems, popItem, sort }
