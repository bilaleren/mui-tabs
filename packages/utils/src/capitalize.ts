function capitalize(value: string): string {
  value = value.toLowerCase()
  return `${value[0].toUpperCase()}${value.slice(1)}`
}

export default capitalize
