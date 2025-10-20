function chance(p: number): [boolean, number] {
  const roll = Math.random() * 100
  return [roll <= p, roll]
}

export { chance }
