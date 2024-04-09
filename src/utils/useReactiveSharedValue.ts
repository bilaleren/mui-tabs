import * as React from 'react'
import {
  makeMutable,
  isSharedValue,
  cancelAnimation,
  SharedValue
} from 'react-native-reanimated'

type Primitive = string | number | boolean

function useReactiveSharedValue<T extends Primitive | SharedValue<Primitive>>(
  value: T
): T extends Primitive ? SharedValue<T> : T {
  const initialValueRef = React.useRef<T>(null)
  const valueRef = React.useRef<SharedValue<T>>(null)

  if (isSharedValue(value)) {
    /**
     * if provided value is a shared value,
     * then we do not initialize another one.
     */
  } else if (valueRef.current === null) {
    // @ts-ignore
    initialValueRef.current = value
    /**
     * if value is an object, then we need to
     * pass a clone.
     */
    if (typeof value === 'object') {
      // @ts-ignore
      valueRef.current = makeMutable({ ...value })
    } else {
      // @ts-ignore
      valueRef.current = makeMutable(value)
    }
  } else if (initialValueRef.current !== value) {
    valueRef.current.value = value as T
  }

  React.useEffect(() => {
    return () => {
      if (valueRef.current) {
        cancelAnimation(valueRef.current)
      }
    }
  }, [])

  // @ts-ignore
  return valueRef.current ?? value
}

export default useReactiveSharedValue
