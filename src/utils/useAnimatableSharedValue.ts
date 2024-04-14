import * as React from 'react'
import {
  makeMutable,
  isSharedValue,
  cancelAnimation,
  SharedValue
} from 'react-native-reanimated'

type Primitive = string | number | boolean

export type AnimatableSharedValue<
  T extends Primitive | SharedValue<Primitive>
> = T extends Primitive ? SharedValue<T> : T

function useAnimatableSharedValue<T extends Primitive | SharedValue<Primitive>>(
  value: T
): AnimatableSharedValue<T> {
  const ref = React.useRef<SharedValue<any>>()

  if (ref.current === undefined && !isSharedValue(value)) {
    ref.current = makeMutable(value)
  }

  React.useEffect(() => {
    return () => {
      if (ref.current) {
        cancelAnimation(ref.current)
      }
    }
  }, [])

  return (ref.current || value) as AnimatableSharedValue<T>
}

export default useAnimatableSharedValue
