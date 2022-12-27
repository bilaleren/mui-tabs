import * as React from 'react'
import useEnhancedEffect from './useEnhancedEffect'

function useEventCallback<Args extends unknown[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return {
  const ref = React.useRef(fn)

  useEnhancedEffect(() => {
    ref.current = fn
  })

  return React.useCallback((...args: Args) => ref.current(...args), [])
}

export default useEventCallback
