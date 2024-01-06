import * as React from 'react'
import { Animated } from 'react-native'

function useAnimatedValue(value: number): Animated.Value {
  const ref = React.useRef(new Animated.Value(value))

  React.useEffect(() => {
    return () => {
      ref.current.stopAnimation()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ref.current.removeAllListeners()
    }
  }, [])

  return ref.current
}

export default useAnimatedValue
