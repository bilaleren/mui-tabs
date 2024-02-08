import * as React from 'react'
import { Animated } from 'react-native'

function useAnimatedValue(value: number): Animated.Value {
  const ref = React.useRef<Animated.Value>()

  if (ref.current === undefined) {
    ref.current = new Animated.Value(value)
  }

  return ref.current
}

export default useAnimatedValue
