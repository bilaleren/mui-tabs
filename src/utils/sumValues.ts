function sumValues(values: number[]): number {
  return values.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  )
}

export default sumValues
