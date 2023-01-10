import * as React from 'react'
import {
  Text,
  View,
  TextProps,
  ViewProps,
  StyleSheet,
  ColorValue,
  GestureResponderEvent
} from 'react-native'
import { DEFAULT_TAB_WIDTH } from '../constants'
import TabButton, { TabButtonProps } from '../TabButton'
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

export interface TabProps extends Omit<TabButtonProps, 'rippleColor'> {
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
   * @default #000
   */
  color?: ColorValue

  /**
   * The icon to display.
   */
  icon?: React.ReactElement<TextProps>

  /**
   * The tab width.
   * @default DEFAULT_TAB_WIDTH
   */
  width?: number | string

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
   * Used to assign a custom indicator.
   */
  indicator?: React.ReactNode

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
   * Override the label props.
   */
  labelProps?: Partial<TextProps>

  /**
   * Override the LabelContainer props.
   */
  labelContainerProps?: Partial<ViewProps>

  /**
   * The component used to render the label.
   */
  LabelComponent?: React.ComponentType<TextProps>

  /**
   * The component used to render the tab.
   */
  ButtonComponent?: React.ComponentType<TabButtonProps>
}

const Tab: React.FC<TabProps> = (props: TabProps) => {
  const {
    value,
    style,
    icon: iconProp,
    label: labelProp,
    color: colorProp = '#000',
    width = DEFAULT_TAB_WIDTH,
    selectedColor = '#1976D2',
    disabledOpacity = 0.2,
    iconPosition = 'top',
    indicator,
    onPress,
    onChange,
    afterLabel,
    beforeLabel,
    selected = false,
    disabled = false,
    labelProps = {},
    LabelComponent = Text,
    ButtonComponent = TabButton,
    labelContainerProps = {},
    ...other
  } = props

  const color = selected ? selectedColor : colorProp
  const icon =
    iconProp && React.isValidElement(iconProp)
      ? React.cloneElement<TextProps>(
          iconProp as React.ReactElement,
          {
            ...iconProp.props,
            style: [{ color }, iconProp.props.style]
          } as TextProps
        )
      : iconProp

  const handlePress = (event: GestureResponderEvent) => {
    if (!selected && !disabled) {
      onChange?.(value as number, event)
    }

    onPress?.(event)
  }

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
        style,
        { width, maxWidth: width }
      ]}
      rippleColor={color}
    >
      {beforeLabel}
      <View
        {...labelContainerProps}
        style={[
          styles.labelContainer,
          iconProp
            ? {
                flexDirection: iconPositionToFlexDirection(iconPosition)
              }
            : false,
          labelContainerProps.style
        ]}
      >
        {icon}
        {typeof labelProp === 'string' ? (
          <LabelComponent
            numberOfLines={1}
            ellipsizeMode="tail"
            {...labelProps}
            style={[styles.tabButtonLabel, { color }, labelProps.style]}
          >
            {labelProp}
          </LabelComponent>
        ) : (
          labelProp
        )}
      </View>
      {afterLabel}
      {indicator}
    </ButtonComponent>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    flexShrink: 0,
    paddingVertical: 12
  },
  tabButtonLabel: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.46,
    textTransform: 'uppercase'
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 17
  }
})

export default Tab
