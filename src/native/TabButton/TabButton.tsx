import * as React from 'react'
import {
  Pressable,
  ViewStyle,
  StyleProp,
  ColorValue,
  PressableProps
} from 'react-native'

type ButtonProps = Omit<PressableProps, 'style' | 'children' | 'disabled'>

export interface TabButtonProps extends ButtonProps {
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  children?: React.ReactNode
  pressColor?: ColorValue
  pressOpacity?: number
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
