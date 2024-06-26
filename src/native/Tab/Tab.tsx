import * as React from 'react'
import {
  Text,
  View,
  StyleProp,
  TextStyle,
  StyleSheet,
  ColorValue
} from 'react-native'
import TabButton, { TabButtonProps } from '../TabButton'
import type {
  TabItem,
  TabValue,
  RenderTabIcon,
  RenderTabBadge,
  RenderTabLabel
} from '../types'

type BaseTabProps = Omit<
  TabButtonProps,
  'disabled' | 'pressColor' | 'pressOpacity'
>

export interface TabProps<Value extends TabValue = TabValue>
  extends BaseTabProps {
  /**
   * The tab item.
   */
  item: TabItem<Value>

  /**
   * Determines the tab width.
   */
  tabWidth?: number

  /**
   * Background color to be applied when the tab is pressed.
   */
  pressColor?: ColorValue

  /**
   * Opacity to be applied when the tab is pressed.
   */
  pressOpacity?: number

  /**
   * Render the tab icon to display.
   */
  renderIcon?: RenderTabIcon<Value>

  /**
   * Render the tab label to display.
   */
  renderLabel?: RenderTabLabel<Value>

  /**
   * Render the tab badge to display.
   */
  renderBadge?: RenderTabBadge<Value>

  /**
   * If `true`, the component is disabled.
   */
  disabled?: boolean

  /**
   * Indicates whether the tab is selected.
   */
  selected?: boolean

  /**
   * The opacity of the disabled tab.
   */
  disabledOpacity?: number

  /**
   * Determines the style of the label.
   */
  labelStyle?: StyleProp<TextStyle>

  /**
   * The component used to render the tab.
   */
  buttonComponent?: React.ComponentType<TabButtonProps>
}

const LABEL_COLOR = '#000000'

const SELECTED_LABEL_COLOR = '#1976D2'

const renderTabLabel: RenderTabLabel = ({ item, style }) => {
  if (item.label == null) {
    return null
  }

  return <Text style={style}>{item.label}</Text>
}

const Tab = <Value extends TabValue>(props: TabProps<Value>) => {
  const {
    item,
    style: tabStyle,
    renderIcon,
    renderLabel = renderTabLabel,
    renderBadge,
    tabWidth,
    selected = false,
    disabled = false,
    disabledOpacity = 0.2,
    labelStyle: labelStyleProp,
    buttonComponent: ButtonComponent = TabButton,
    ...other
  } = props

  const labelStyle = StyleSheet.flatten(labelStyleProp)

  const labelColor =
    labelStyle?.color || (selected ? SELECTED_LABEL_COLOR : LABEL_COLOR)

  const icon = renderIcon
    ? renderIcon({
        item,
        color: labelColor,
        selected,
        disabled
      })
    : null

  const label =
    item.label != null
      ? renderLabel({
          item,
          color: labelColor,
          style: [styles.label, { color: labelColor }, labelStyle],
          selected,
          disabled
        })
      : null

  const badge = renderBadge
    ? renderBadge({
        item,
        color: labelColor,
        selected,
        disabled
      })
    : null

  return (
    <ButtonComponent
      unstable_pressDelay={0}
      {...other}
      disabled={disabled}
      accessibilityRole="tab"
      accessibilityState={{ disabled, selected }}
      style={[
        styles.pressable,
        disabled ? { opacity: disabledOpacity } : null,
        tabWidth != null ? { width: tabWidth } : null
      ]}
    >
      <View
        style={[
          styles.item,
          tabStyle,
          // remove tab width prop from tabStyle
          tabWidth != null ? { width: undefined } : null
        ]}
        pointerEvents="none"
      >
        {icon != null ? <View>{icon}</View> : null}
        {label != null ? <View>{label}</View> : null}
        {badge != null ? <View style={styles.badge}>{badge}</View> : null}
      </View>
    </ButtonComponent>
  )
}

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: 'transparent'
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    maxHeight: 80,
    paddingVertical: 10,
    paddingHorizontal: 17
  },
  label: {
    fontSize: 14,
    fontWeight: '500'
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0
  }
})

export default Tab
