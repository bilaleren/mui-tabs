import * as React from 'react'
import {
  Pressable,
  ViewStyle,
  StyleProp,
  ColorValue,
  PressableProps,
  GestureResponderEvent
} from 'react-native'

type ButtonProps = Pick<
  PressableProps,
  | 'onLayout'
  | 'android_ripple'
  | 'accessibilityRole'
  | 'accessibilityLabel'
  | 'accessibilityState'
  | 'unstable_pressDelay'
>

export interface TabButtonProps extends ButtonProps {
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  children?: React.ReactNode
  rippleColor?: ColorValue | null
  onPress?: ((event: GestureResponderEvent) => void) | undefined
  onLongPress?: ((event: GestureResponderEvent) => void) | undefined
}

const TabButton: React.FC<TabButtonProps> = (props) => {
  const { children, ...other } = props

  return (
    <Pressable accessibilityRole="button" {...other}>
      {children}
    </Pressable>
  )
}

export default TabButton
