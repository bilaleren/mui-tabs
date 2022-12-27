import type { GestureResponderEvent } from 'react-native'

export type TabValue = string | number

export type IconPosition = 'top' | 'start' | 'end' | 'bottom'

export type ChangeHandler<Value extends TabValue = number> = (
  value: Value,
  event: GestureResponderEvent
) => void
