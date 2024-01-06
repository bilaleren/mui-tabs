import type { Animated, GestureResponderEvent } from 'react-native'

export type TabValue = string | number

export type TabsVariant = 'scrollable' | 'standard' | 'fullWidth'

export type IconPosition = 'top' | 'start' | 'end' | 'bottom'

export type ChangeHandler<Value extends TabValue = any> = (
  value: Value,
  event: GestureResponderEvent
) => void

export type IndicatorAnimationCallback = (
  value: number,
  animatedValue: Animated.Value,
  type: 'width' | 'position'
) => Animated.CompositeAnimation
