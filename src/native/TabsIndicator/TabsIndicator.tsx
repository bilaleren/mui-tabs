import * as React from 'react'
import { Animated, StyleProp, ViewStyle, StyleSheet } from 'react-native'
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
  position: Animated.AnimatedInterpolation<number>

  /**
   * Determines the style of the indicator.
   */
  style?: StyleProp<ViewStyle>
}

const getWidth = (
  position: Animated.AnimatedInterpolation<number>,
  tabs: TabItem[],
  getTabWidth: GetTabWidth
) => {
  const inputRange = tabs.map((_, index) => index)
  const outputRange = inputRange.map(getTabWidth)

  if (tabs.length > 1) {
    return position.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp'
    })
  }

  return outputRange[0]
}

const getTranslateX = (
  position: Animated.AnimatedInterpolation<number>,
  tabs: TabItem[],
  getTabWidth: GetTabWidth,
  tabGap: number
) => {
  if (tabs.length > 1) {
    const inputRange = tabs.map((_, index) => index)
    const outputRange = tabs.reduce<number[]>((acc, _, index) => {
      if (index === 0) {
        return [0]
      }

      return [...acc, acc[index - 1] + getTabWidth(index - 1) + tabGap]
    }, [])

    return position.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp'
    })
  }

  return 0
}

const TabsIndicator: React.FC<TabsIndicatorProps> = (props) => {
  const { tabs, style, tabGap, getTabWidth, position } = props

  const width = getWidth(position, tabs, getTabWidth)
  const translateX = getTranslateX(position, tabs, getTabWidth, tabGap)

  return (
    <Animated.View
      style={[
        styles.indicator,
        { width },
        { transform: [{ translateX }] },
        style
      ]}
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
