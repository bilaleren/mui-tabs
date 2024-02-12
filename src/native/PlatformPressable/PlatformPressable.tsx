import * as React from 'react'
import { Pressable } from 'react-native'
import RippleButton from '../RippleButton'
import type { TabButtonProps } from '../TabButton'

export type PlatformPressableProps = TabButtonProps

const PlatformPressable: React.FC<PlatformPressableProps> = (props) => {
  const { children, style, pressColor, pressOpacity = 0.3, ...other } = props

  if (RippleButton.supported) {
    return (
      <RippleButton {...other} style={style} pressColor={pressColor}>
        {children}
      </RippleButton>
    )
  }

  return (
    <Pressable
      {...other}
      style={({ pressed }) => [
        pressed ? { opacity: pressOpacity } : null,
        style
      ]}
    >
      {children}
    </Pressable>
  )
}

export default PlatformPressable
