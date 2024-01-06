import * as React from 'react'
import {
  Text,
  View,
  StyleSheet,
  TextProps,
  StyleProp,
  TextStyle,
  ViewStyle,
  ColorValue,
  GestureResponderEvent
} from 'react-native'
import TabButton, { TabButtonProps } from '../TabButton'
import useLatestCallback from 'use-latest-callback'
import type { TabValue, IconPosition, ChangeHandler } from '../types'

function iconPositionToFlexDirection(position: IconPosition) {
  switch (position) {
    default:
    case 'top':
      return 'column'
    case 'bottom':
      return 'column-reverse'
    case 'start':
      return 'row'
    case 'end':
      return 'row-reverse'
  }
}

type BaseTabProps = Omit<TabButtonProps, 'rippleColor'>

export interface TabProps extends BaseTabProps {
  /**
   * The label element.
   */
  label?: React.ReactNode

  /**
   * You can provide your own value. Otherwise, we fallback to the child position index.
   */
  value?: TabValue

  /**
   * The color of the label.
   * @default #000000
   */
  color?: ColorValue

  /**
   * The icon to display.
   */
  icon?: React.ReactElement<TextProps>

  /**
   * Indicates whether the tab is selected.
   * @default false
   */
  selected?: boolean

  /**
   * The content used to after the tab label.
   */
  afterLabel?: React.ReactNode

  /**
   * The content used to before the tab label.
   */
  beforeLabel?: React.ReactNode

  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled?: boolean

  /**
   * The position of the icon relative to the label.
   * @default 'top'
   */
  iconPosition?: IconPosition

  /**
   * The opacity of the disabled tab.
   * @default 0.2
   */
  disabledOpacity?: number

  /**
   * The color of the selected label.
   * @default #1976D2
   */
  selectedColor?: ColorValue

  /**
   * Callback fired when the value changes.
   */
  onChange?: ChangeHandler

  /**
   * Override the selected tab style.
   */
  selectedStyle?: StyleProp<ViewStyle>

  /**
   * Override the disabled tab style.
   */
  disabledStyle?: StyleProp<ViewStyle>

  /**
   * Override the label style.
   */
  labelStyle?: StyleProp<TextStyle>

  /**
   * Override the selected label style.
   */
  selectedLabelStyle?: StyleProp<TextStyle>

  /**
   * Override the disabled label style.
   */
  disabledLabelStyle?: StyleProp<TextStyle>

  /**
   * The component used to render the tab.
   */
  ButtonComponent?: React.ComponentType<TabButtonProps>
}

const Tab: React.FC<TabProps> = (props: TabProps) => {
  const {
    value,
    style: tabStyleProp,
    selectedStyle: selectedStyleProp,
    disabledStyle: disabledStyleProp,
    icon: iconProp,
    label: labelProp,
    color: colorProp = '#000000',
    selectedColor = '#1976D2',
    disabledOpacity = 0.2,
    iconPosition = 'top',
    onPress,
    onChange,
    afterLabel,
    beforeLabel,
    selected = false,
    disabled = false,
    labelStyle: labelStyleProp,
    selectedLabelStyle: selectedLabelStyleProp,
    disabledLabelStyle: disabledLabelStyleProp,
    ButtonComponent = TabButton,
    ...other
  } = props

  const color = selected ? selectedColor : colorProp
  const hasIcon = !!iconProp

  const icon =
    hasIcon && React.isValidElement(iconProp)
      ? React.cloneElement(iconProp, {
          ...iconProp.props,
          style: [{ color }, iconProp.props.style]
        })
      : iconProp

  const tabStyle =
    selected && selectedStyleProp
      ? selectedStyleProp
      : disabled && disabledStyleProp
      ? disabledStyleProp
      : tabStyleProp

  const labelStyle =
    selected && selectedLabelStyleProp
      ? selectedLabelStyleProp
      : disabled && disabledLabelStyleProp
      ? disabledLabelStyleProp
      : labelStyleProp

  const handlePress = useLatestCallback((event: GestureResponderEvent) => {
    if (!selected && !disabled) {
      onChange?.(value as any, event)
    }

    onPress?.(event)
  })

  return (
    <ButtonComponent
      {...other}
      disabled={disabled}
      onPress={handlePress}
      accessibilityRole="tab"
      accessibilityState={{ disabled, selected }}
      style={[
        styles.container,
        disabled && { opacity: disabledOpacity },
        tabStyle
      ]}
      rippleColor={color}
    >
      {beforeLabel}
      <View
        style={[
          styles.labelContainer,
          hasIcon && styles.labelContainerWithIcon,
          hasIcon && {
            flexDirection: iconPositionToFlexDirection(iconPosition)
          }
        ]}
      >
        {icon}
        {typeof labelProp === 'string' ? (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.label, { color }, labelStyle]}
          >
            {labelProp}
          </Text>
        ) : (
          labelProp
        )}
      </View>
      {afterLabel}
    </ButtonComponent>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexShrink: 0,
    paddingVertical: 12
  },
  label: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.46
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 17
  },
  labelContainerWithIcon: {
    gap: 3
  }
})

export default Tab
