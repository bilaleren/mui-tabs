import * as React from 'react'
import { StyleProp, ViewStyle, StyleSheet } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  Extrapolation,
  SharedValue
} from 'react-native-reanimated'
import type { TabItemLayout } from '../types'

type GetTabWidth = (index: number) => number

export interface TabsIndicatorProps {
  /**
   * The tab items layout.
   */
  itemsLayout: TabItemLayout[]

  /**
   * Gets the width of the tab.
   */
  getTabWidth: GetTabWidth

  /**
   * The tab determines its gap.
   */
  tabGap: number

  /**
   * Animated position value.
   */
  position: SharedValue<number>

  /**
   * Determines the style of the indicator.
   */
  style?: StyleProp<ViewStyle>
}

const getWidth = (
  position: SharedValue<number>,
  layouts: TabItemLayout[],
  getTabWidth: GetTabWidth
): number => {
  'worklet'

  const inputRange = layouts.map((_, index) => index)
  const outputRange = inputRange.map(getTabWidth)

  if (inputRange.length > 1) {
    return interpolate(
      position.value,
      inputRange,
      outputRange,
      Extrapolation.EXTEND
    )
  }

  return outputRange[0]
}

const getTranslateX = (
  position: SharedValue<number>,
  layouts: TabItemLayout[],
  tabGap: number,
  getTabWidth: GetTabWidth
): number => {
  'worklet'

  if (layouts.length > 1) {
    const inputRange = layouts.map((_, index) => index)
    const outputRange = layouts.reduce<number[]>((acc, _, index) => {
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
  const { itemsLayout, style, tabGap, position, getTabWidth } = props

  const animatedStyle = useAnimatedStyle(
    () => ({
      width: getWidth(position, itemsLayout, getTabWidth),
      transform: [
        {
          translateX: getTranslateX(position, itemsLayout, tabGap, getTabWidth)
        }
      ]
    }),
    [position, itemsLayout]
  )

  return (
    <Animated.View
      style={[styles.container, animatedStyle, style]}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden={true}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#1976D2'
  }
})

export default TabsIndicator
