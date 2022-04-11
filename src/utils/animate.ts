function easeInOutSin(time: number): number {
  return (1 + Math.sin(Math.PI * time - Math.PI / 2)) / 2
}

interface AnimateOptions {
  to: number
  element: Element
  property: keyof Element
  ease?: (time: number) => number
  duration?: number
  callback?: (value: Error | null) => void
}

function animate(options: AnimateOptions): () => void {
  const {
    element,
    property,
    to,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    callback = () => {},
    ease = easeInOutSin,
    duration = 300
  } = options

  let start: number | null = null
  const from = element[property]
  let cancelled = false

  const cancel = () => {
    cancelled = true
  }

  const step = (timestamp: number) => {
    if (cancelled) {
      callback(new Error('Animation cancelled'))
      return
    }

    if (start === null) {
      start = timestamp
    }

    const time = Math.min(1, (timestamp - start) / duration)

    // @ts-ignore
    element[property] = ease(time) * (to - from) + from

    if (time >= 1) {
      // eslint-disable-next-line no-undef
      requestAnimationFrame(() => {
        callback(null)
      })
      return
    }

    // eslint-disable-next-line no-undef
    requestAnimationFrame(step)
  }

  if (from === to) {
    callback(new Error('Element already at target position'))
    return cancel
  }

  // eslint-disable-next-line no-undef
  requestAnimationFrame(step)

  return cancel
}

export default animate
