import * as React from 'react'
import { Platform, StyleSheet } from 'react-native'
import TabButton, { TabButtonProps } from '../TabButton'

const ANDROID_VERSION_PIE = 28
const ANDROID_VERSION_LOLLIPOP = 21

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
    borderless,
    pressColor = 'rgba(0, 0, 0, .32)',
    android_ripple: androidRipple,
    ...other
  } = props

  if (RippleButton.supported) {
    const useForeground =
      Platform.OS === 'android' &&
      Platform.Version >= ANDROID_VERSION_PIE &&
      borderless

    return (
      <TabButton
        {...other}
        style={[borderless ? styles.overflowHidden : null, style]}
        android_ripple={{
          color: pressColor,
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
