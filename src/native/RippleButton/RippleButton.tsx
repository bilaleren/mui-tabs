import * as React from 'react'
import { Platform, StyleSheet, ColorValue } from 'react-native'
import color from 'color'
import TabButton, { TabButtonProps } from '../TabButton'

const ANDROID_VERSION_PIE = 28
const ANDROID_VERSION_LOLLIPOP = 21

const getRippleColor = (rippleColor: ColorValue): string => {
  return color(rippleColor).alpha(0.2).rgb().string()
}

type RippleButtonComponent = React.FC<RippleButtonProps> & {
  supported: boolean
}

export interface RippleButtonProps extends TabButtonProps {
  borderless?: boolean
}

const RippleButton: RippleButtonComponent = (props) => {
  const {
    children,
    style,
    rippleColor,
    borderless = false,
    android_ripple: androidRipple,
    ...other
  } = props

  if (rippleColor && RippleButton.supported) {
    const useForeground =
      Platform.OS === 'android' &&
      Platform.Version >= ANDROID_VERSION_PIE &&
      borderless

    return (
      <TabButton
        {...other}
        style={[borderless ? styles.overflowHidden : null, style]}
        android_ripple={{
          color: getRippleColor(rippleColor),
          borderless,
          foreground: useForeground,
          ...androidRipple
        }}
      >
        {children}
      </TabButton>
    )
  }

  return (
    <TabButton
      {...other}
      style={[borderless ? styles.overflowHidden : null, style]}
    >
      {children}
    </TabButton>
  )
}

RippleButton.supported =
  Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP

const styles = StyleSheet.create({
  overflowHidden: {
    overflow: 'hidden'
  }
})

export default RippleButton
