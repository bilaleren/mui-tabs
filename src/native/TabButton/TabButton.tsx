import * as React from 'react'
import {
  Pressable,
  ViewStyle,
  StyleProp,
  ColorValue,
  StyleSheet,
  PressableProps
} from 'react-native'

type ButtonProps = Omit<PressableProps, 'style' | 'children'>

export interface TabButtonProps extends ButtonProps {
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
  rippleColor?: ColorValue | null
}

const TabButton: React.FC<TabButtonProps> = (props: TabButtonProps) => {
  const { style, children, ...other } = props

  return (
    <Pressable
      accessibilityRole="button"
      {...other}
      style={[styles.container, style]}
    >
      {children}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: 'transparent'
  }
})

export default TabButton
