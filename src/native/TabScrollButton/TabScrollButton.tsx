import * as React from 'react'
import {
  Easing,
  Animated,
  StyleSheet,
  StyleProp,
  ColorValue,
  ImageStyle,
  ImageRequireSource
} from 'react-native'
import TabButton, { TabButtonProps } from '../TabButton'
import useAnimatedValue from '@utils/useAnimatedValue'

export type TabScrollButtonType = 'start' | 'end'

export interface TabScrollButtonProps extends TabButtonProps {
  type: TabScrollButtonType
  iconSize?: number
  iconColor?: ColorValue
  opacity?: number
  disabledOpacity?: number
  iconStyle?: StyleProp<ImageStyle>
  iconImage?: ImageRequireSource
  ButtonComponent?: React.ComponentType<TabButtonProps>
}

export interface TabScrollButtonRefAttributes {
  setDisabled: (value: boolean) => void
}

const TabScrollButton = React.forwardRef<
  TabScrollButtonRefAttributes,
  TabScrollButtonProps
>((props, ref) => {
  const {
    type,
    style,
    disabled: defaultDisabled = false,
    iconStyle,
    opacity = 1,
    iconSize = 18,
    iconColor = '#000000',
    iconImage = require('@assets/chevron-left-outline.png'),
    disabledOpacity = 0.4,
    ButtonComponent = TabButton,
    ...other
  } = props

  const [disabled, setDisabled] = React.useState(defaultDisabled)
  const opacityValue = useAnimatedValue(disabled ? disabledOpacity : opacity)

  React.useImperativeHandle(
    ref,
    () => ({
      setDisabled(value): void {
        setDisabled(value)
        Animated.timing(opacityValue, {
          toValue: value ? disabledOpacity : opacity,
          delay: 0,
          duration: 200,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true
        }).start()
      }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <ButtonComponent
      {...other}
      style={[styles.container, style]}
      disabled={disabled}
      rippleColor={iconColor}
    >
      <Animated.Image
        source={iconImage}
        style={[
          iconStyle,
          {
            width: iconSize,
            height: iconSize,
            opacity: opacityValue
          },
          type === 'end' && styles.endIcon
        ]}
        tintColor={iconColor}
        resizeMode="center"
        fadeDuration={0}
        accessibilityRole="none"
        importantForAccessibility="no-hide-descendants"
      />
    </ButtonComponent>
  )
})

const styles = StyleSheet.create({
  container: {
    width: 40
  },
  endIcon: {
    transform: [
      {
        rotate: '180deg'
      }
    ]
  }
})

export default TabScrollButton
