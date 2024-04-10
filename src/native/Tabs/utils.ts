import { StyleSheet, ViewStyle, StyleProp, DimensionValue } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'
import type { TabItem, TabItemLayout } from '../types'

const convertPercentToSize = (
  value: DimensionValue | undefined,
  layoutWidth: number
): number => {
  'worklet'

  switch (typeof value) {
    case 'number':
      return value
    case 'string':
      if (value.endsWith('%')) {
        const width = parseFloat(value)
        if (Number.isFinite(width)) {
          return layoutWidth * (width / 100)
        }
      }
  }

  return 0
}

const calculateTotalPadding = ({
  layoutWidth,
  flattenedPaddingLeft,
  flattenedPaddingRight
}: {
  layoutWidth: number
  flattenedPaddingLeft: DimensionValue | undefined
  flattenedPaddingRight: DimensionValue | undefined
}): number => {
  'worklet'
  return (
    convertPercentToSize(flattenedPaddingLeft, layoutWidth) +
    convertPercentToSize(flattenedPaddingRight, layoutWidth)
  )
}

export const getComputedTabWidth = ({
  index,
  tabGap,
  itemsLayout,
  layoutWidth,
  scrollEnabled,
  estimatedTabWidth,
  flattenedTabWidth,
  flattenedPaddingLeft,
  flattenedPaddingRight
}: {
  index: number
  tabGap: number
  itemsLayout: TabItemLayout[]
  layoutWidth: number
  scrollEnabled: boolean
  estimatedTabWidth: number
  flattenedTabWidth: DimensionValue | undefined
  flattenedPaddingLeft: DimensionValue | undefined
  flattenedPaddingRight: DimensionValue | undefined
}): number => {
  'worklet'

  if (flattenedTabWidth === 'auto') {
    return itemsLayout[index]?.width ?? estimatedTabWidth
  } else if (flattenedTabWidth != null) {
    return convertPercentToSize(flattenedTabWidth, layoutWidth)
  } else if (scrollEnabled) {
    return (layoutWidth / 5) * 2
  }

  const totalGapWidth = (tabGap ?? 0) * Math.max(0, itemsLayout.length - 1)
  const totalPadding = calculateTotalPadding({
    layoutWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight
  })

  return (layoutWidth - totalGapWidth - totalPadding) / itemsLayout.length
}

const getTabsWidth = ({
  tabGap,
  itemsLayout,
  layoutWidth,
  scrollEnabled,
  estimatedTabWidth,
  flattenedTabWidth,
  flattenedPaddingLeft,
  flattenedPaddingRight
}: {
  tabGap: number
  itemsLayout: TabItemLayout[]
  layoutWidth: number
  scrollEnabled: boolean
  estimatedTabWidth: number
  flattenedTabWidth: DimensionValue | undefined
  flattenedPaddingLeft: DimensionValue | undefined
  flattenedPaddingRight: DimensionValue | undefined
}) => {
  'worklet'

  const totalPadding = Math.max(
    0,
    convertPercentToSize(flattenedPaddingLeft, layoutWidth) +
      convertPercentToSize(flattenedPaddingRight, layoutWidth)
  )

  return itemsLayout.reduce<number>(
    (total, _, index) =>
      total +
      (index > 0 ? tabGap ?? 0 : 0) +
      getComputedTabWidth({
        index,
        tabGap,
        itemsLayout,
        layoutWidth,
        scrollEnabled,
        estimatedTabWidth,
        flattenedTabWidth,
        flattenedPaddingLeft,
        flattenedPaddingRight
      }),
    totalPadding
  )
}

const normalizeScrollOffset = ({
  tabGap,
  itemsLayout,
  scrollValue,
  layoutWidth,
  estimatedTabWidth,
  flattenedTabWidth,
  flattenedPaddingLeft,
  flattenedPaddingRight
}: {
  tabGap: number
  itemsLayout: TabItemLayout[]
  scrollValue: number
  layoutWidth: number
  estimatedTabWidth: number
  flattenedTabWidth: DimensionValue | undefined
  flattenedPaddingLeft: DimensionValue | undefined
  flattenedPaddingRight: DimensionValue | undefined
}) => {
  'worklet'

  const tabsWidth = getTabsWidth({
    tabGap,
    itemsLayout,
    layoutWidth,
    scrollEnabled: true,
    estimatedTabWidth,
    flattenedTabWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight
  })

  return Math.max(Math.min(scrollValue, tabsWidth - layoutWidth), 0)
}

export const getScrollOffset = ({
  tabGap,
  position,
  itemsLayout,
  layoutWidth,
  estimatedTabWidth,
  flattenedTabWidth,
  flattenedPaddingLeft,
  flattenedPaddingRight
}: {
  tabGap: number
  position: SharedValue<number>
  itemsLayout: TabItemLayout[]
  layoutWidth: number
  estimatedTabWidth: number
  flattenedTabWidth: DimensionValue | undefined
  flattenedPaddingLeft: DimensionValue | undefined
  flattenedPaddingRight: DimensionValue | undefined
}) => {
  'worklet'

  const initialPadding = convertPercentToSize(flattenedPaddingLeft, layoutWidth)
  const centerDistance = Array.from({
    length: position.value + 1
  }).reduce<number>((total, _, index) => {
    const tabWidth = getComputedTabWidth({
      index,
      tabGap,
      itemsLayout,
      layoutWidth,
      scrollEnabled: true,
      estimatedTabWidth,
      flattenedTabWidth,
      flattenedPaddingLeft,
      flattenedPaddingRight
    })

    return (
      total +
      (index > 0 ? tabGap ?? 0 : 0) +
      (index === position.value ? tabWidth / 2 : tabWidth)
    )
  }, initialPadding)
  const scrollAmount = centerDistance - layoutWidth / 2

  return normalizeScrollOffset({
    tabGap,
    itemsLayout,
    layoutWidth,
    scrollValue: scrollAmount,
    estimatedTabWidth,
    flattenedTabWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight
  })
}

export const getFlattenedWidth = (style: StyleProp<ViewStyle>) => {
  const tabStyle = StyleSheet.flatten(style)
  return tabStyle?.width
}

export const getInitialItemsLayout = ({
  tabs,
  tabGap,
  layoutWidth,
  scrollEnabled,
  estimatedTabWidth,
  flattenedTabWidth,
  flattenedPaddingLeft,
  flattenedPaddingRight
}: {
  tabs: TabItem[]
  tabGap: number
  layoutWidth: number
  scrollEnabled: boolean
  estimatedTabWidth: number
  flattenedTabWidth: DimensionValue | undefined
  flattenedPaddingLeft: DimensionValue | undefined
  flattenedPaddingRight: DimensionValue | undefined
}): TabItemLayout[] => {
  const tabWidth = getComputedTabWidth({
    index: -1,
    tabGap,
    itemsLayout: [],
    layoutWidth,
    scrollEnabled,
    estimatedTabWidth,
    flattenedTabWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight
  })
  const totalPadding = calculateTotalPadding({
    layoutWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight
  })

  return tabs.map((_, index) => ({
    x: index * (tabWidth + tabGap) - totalPadding,
    width: tabWidth
  }))
}

export const getFlattenedPaddingValues = (style: StyleProp<ViewStyle>) => {
  const flattenStyle = StyleSheet.flatten(style)

  if (!flattenStyle) {
    return {
      left: 0,
      right: 0
    }
  }

  return {
    left: flattenStyle.paddingLeft || flattenStyle.paddingHorizontal || 0,
    right: flattenStyle.paddingRight || flattenStyle.paddingHorizontal || 0
  }
}
