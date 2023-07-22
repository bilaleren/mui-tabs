import * as React from 'react'
import {
  StyleSheet,
  I18nManager,
  StyleProp,
  ViewStyle,
  ColorValue
} from 'react-native'
import TabButton, { TabButtonProps } from '../TabButton'
import { DEFAULT_SCROLL_BUTTON_WIDTH } from '../constants'
import Svg, { Path, SvgProps, NumberProp } from 'react-native-svg'

const Icon: React.FC<SvgProps> = (props: SvgProps) => {
  const { style, children, ...other } = props

  return (
    <Svg
      fill="#000"
      stroke="#000"
      width={18}
      height={18}
      fontWeight="700"
      {...other}
      style={[
        style,
        I18nManager.isRTL && {
          transform: [{ rotate: '180deg' }]
        }
      ]}
      viewBox="0 0 24 24"
      strokeWidth="0"
    >
      {children}
    </Svg>
  )
}

const ChevronLeft: React.FC<SvgProps> = (props: SvgProps) => (
  <Icon {...props}>
    <Path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </Icon>
)

const ChevronRight: React.FC<SvgProps> = (props: SvgProps) => (
  <Icon {...props}>
    <Path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </Icon>
)

export interface TabScrollButtonProps extends TabButtonProps {
  iconSize?: NumberProp
  iconColor?: ColorValue
  opacity?: number
  disableOpacity?: number
  direction: 'left' | 'right'
  iconStyle?: StyleProp<ViewStyle>
  ButtonComponent?: React.ComponentType<TabButtonProps>
}

const TabScrollButton: React.FC<TabScrollButtonProps> = (
  props: TabScrollButtonProps
) => {
  const {
    style,
    disabled,
    direction,
    iconStyle,
    opacity = 0.8,
    iconSize = 18,
    iconColor = '#000',
    disableOpacity = 0,
    ButtonComponent = TabButton,
    ...other
  } = props

  const IconComponent = direction === 'left' ? ChevronLeft : ChevronRight

  return (
    <ButtonComponent
      {...other}
      style={[styles.container, style]}
      disabled={disabled}
      rippleColor={iconColor}
    >
      <IconComponent
        fill={iconColor}
        stroke={iconColor}
        width={iconSize}
        height={iconSize}
        style={[
          disabled ? { opacity: disableOpacity } : { opacity },
          iconStyle
        ]}
      />
    </ButtonComponent>
  )
}

const styles = StyleSheet.create({
  container: {
    width: DEFAULT_SCROLL_BUTTON_WIDTH,
    flexShrink: 0
  }
})

export default TabScrollButton
