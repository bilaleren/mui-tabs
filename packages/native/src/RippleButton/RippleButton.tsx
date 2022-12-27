import * as React from 'react'
import color from 'color'
import { Platform, StyleSheet, ColorValue } from 'react-native'
import TabButton, { TabButtonProps } from '../TabButton'

const ANDROID_VERSION_PIE = 28
const ANDROID_VERSION_LOLLIPOP = 21

function getRippleColor(rippleColor: ColorValue): string {
  return color(rippleColor).alpha(0.2).rgb().string()
}

type RippleButtonComponent = React.FC<RippleButtonProps> & {
  supported: boolean
}

export interface RippleButtonProps extends TabButtonProps {
  borderless?: boolean
}

const RippleButton: RippleButtonComponent = (props: RippleButtonProps) => {
  const { children, style, rippleColor, borderless = false, ...other } = props

  if (rippleColor && RippleButton.supported) {
    const useForeground =
      Platform.OS === 'android' &&
      Platform.Version >= ANDROID_VERSION_PIE &&
      borderless

    return (
      <TabButton
        {...other}
        style={[borderless && styles.overflowHidden, style]}
        android_ripple={{
          color: getRippleColor(rippleColor),
          borderless,
          foreground: useForeground
        }}
      >
        {children}
      </TabButton>
    )
  }

  return (
    <TabButton {...other} style={[borderless && styles.overflowHidden, style]}>
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
