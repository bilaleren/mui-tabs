function flattenSize(
  size: string | number | undefined,
  totalSize: number
): number | undefined {
  switch (typeof size) {
    case 'number':
      return size
    case 'string':
      if (size.endsWith('%')) {
        const flatten = parseFloat(size)

        if (Number.isFinite(flatten)) {
          return totalSize * (flatten / 100)
        }
      }
  }

  return undefined
}

export default flattenSize
