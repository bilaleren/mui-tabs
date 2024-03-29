export interface Cancelable {
  clear(): void
}

type DebounceFunc = (...args: any[]) => any

function debounce<T extends DebounceFunc>(func: T, wait = 166): T & Cancelable {
  let timeout: NodeJS.Timeout

  function debounced(this: unknown, ...args: any[]): void {
    const later = () => {
      func.apply(this, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }

  debounced.clear = () => clearTimeout(timeout)

  return debounced as T & Cancelable
}

export default debounce
