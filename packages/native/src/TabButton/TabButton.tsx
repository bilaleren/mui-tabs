import * as React from 'react'
import {
  Pressable,
  ViewStyle,
  StyleProp,
  ColorValue,
  StyleSheet,
  PressableProps
} from 'react-native'

type ButtonProps = Partial<Omit<PressableProps, 'style'>>

export interface TabButtonProps extends ButtonProps {
  style?: StyleProp<ViewStyle>
  rippleColor?: ColorValue | null
}

const TabButton: React.FC<TabButtonProps> = (props: TabButtonProps) => {
  const { style, children, ...other } = props

  return (
    <Pressable {...other} style={[styles.container, style]}>
      {children}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    borderWidth: 0,
    borderRadius: 0,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: 'transparent'
  }
})

export default TabButton
