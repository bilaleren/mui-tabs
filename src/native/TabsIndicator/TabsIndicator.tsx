import * as React from 'react'
import { StyleProp, ViewStyle, StyleSheet } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  Extrapolation,
  SharedValue
} from 'react-native-reanimated'
import type { TabItem } from '../types'

type GetTabWidth = (index: number) => number

export interface TabsIndicatorProps {
  /**
   * The tab items.
   */
  tabs: TabItem[]

  /**
   * Gets the width of the tab.
   */
  getTabWidth: GetTabWidth

  /**
   * The tab determines its gap.
   */
  tabGap: number

  /**
   * Custom animated interpolation value.
   */
  position: SharedValue<number>

  /**
   * Determines the style of the indicator.
   */
  style?: StyleProp<ViewStyle>
}

const getWidth = (
  position: SharedValue<number>,
  tabs: TabItem[],
  getTabWidth: GetTabWidth
): number => {
  'worklet'

  const inputRange = tabs.map((_, index) => index)
  const outputRange = inputRange.map(getTabWidth)

  if (tabs.length > 1) {
    return interpolate(
      position.value,
      inputRange,
      outputRange,
      Extrapolation.CLAMP
    )
  }

  return outputRange[0]
}

const getTranslateX = (
  position: SharedValue<number>,
  tabs: TabItem[],
  getTabWidth: GetTabWidth,
  tabGap: number
): number => {
  'worklet'

  if (tabs.length > 1) {
    const inputRange = tabs.map((_, index) => index)
    const outputRange = tabs.reduce<number[]>((acc, _, index) => {
      if (index === 0) {
        return [0]
      }

      return [...acc, acc[index - 1] + getTabWidth(index - 1) + tabGap]
    }, [])

    return interpolate(
      position.value,
      inputRange,
      outputRange,
      Extrapolation.CLAMP
    )
  }

  return 0
}

const TabsIndicator: React.FC<TabsIndicatorProps> = (props) => {
  const { tabs, style, tabGap, position, getTabWidth } = props

  const animatedStyle = useAnimatedStyle(() => ({
    width: getWidth(position, tabs, getTabWidth),
    transform: [
      {
        translateX: getTranslateX(position, tabs, getTabWidth, tabGap)
      }
    ]
  }))

  return (
    <Animated.View
      style={[styles.indicator, animatedStyle, style]}
      accessibilityRole="none"
    />
  )
}

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: '#1976D2'
  }
})

export default TabsIndicator
