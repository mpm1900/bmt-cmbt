function chance(p: number) {
  return Math.random() * 100 <= p
}

export { chance }
