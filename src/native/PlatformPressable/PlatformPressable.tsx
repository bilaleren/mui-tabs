import * as React from 'react'
import { Pressable } from 'react-native'
import RippleButton from '../RippleButton'
import type { TabButtonProps } from '../TabButton'

export type PlatformPressableProps = TabButtonProps

const PlatformPressable: React.FC<PlatformPressableProps> = (props) => {
  const { children, style, rippleColor, ...other } = props

  if (RippleButton.supported) {
    return (
      <RippleButton {...other} style={style} rippleColor={rippleColor}>
        {children}
      </RippleButton>
    )
  }

  return (
    <Pressable
      {...other}
      style={({ pressed }) => [pressed ? { opacity: 0.3 } : null, style]}
    >
      {children}
    </Pressable>
  )
}

export default PlatformPressable
