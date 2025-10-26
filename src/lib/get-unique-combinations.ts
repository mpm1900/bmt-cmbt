function getUniqueCombinations<T>(arr: T[], n: number): T[][] {
  if (n === 0) {
    return [[]]
  }
  if (arr.length < n) {
    return []
  }

  const firstElement = arr[0]
  const restOfArray = arr.slice(1)

  const combinationsWithFirst = getUniqueCombinations(restOfArray, n - 1)
  const fullCombinations = combinationsWithFirst.map((combination) => [
    firstElement,
    ...combination,
  ])
  const combinationsWithoutFirst = getUniqueCombinations(restOfArray, n)
  return [...fullCombinations, ...combinationsWithoutFirst]
}

export { getUniqueCombinations }
