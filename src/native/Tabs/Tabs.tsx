import * as React from 'react'
import {
  View,
  Dimensions,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  ColorValue,
  DimensionValue,
  ScrollViewProps,
  LayoutChangeEvent
} from 'react-native'
import Animated, {
  Easing,
  runOnUI,
  runOnJS,
  scrollTo,
  withTiming,
  cancelAnimation,
  useSharedValue,
  useAnimatedRef,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  SharedValue,
  WithTimingConfig,
  AnimationCallback
} from 'react-native-reanimated'
import { dequal as isEqual } from 'dequal/lite'
import Tab, { TabProps } from '../Tab'
import TabsIndicator from '../TabsIndicator'
import type { TabButtonProps } from '../TabButton'
import useReactiveSharedValue from '@utils/useReactiveSharedValue'
import type {
  TabItem,
  TabValue,
  OnChange,
  OnTabPress,
  ChangeEvent,
  TabItemLayout,
  RenderTabItem,
  RenderTabLabel,
  RenderTabIcon,
  RenderTabBadge,
  OnTabLongPress,
  RenderTabsIndicator
} from '../types'

export interface TabsProps<Value extends TabValue = TabValue> {
  /**
   * The tab items.
   */
  tabs: TabItem<Value>[]

  /**
   * Determines the style of the container.
   */
  style?: StyleProp<ViewStyle>

  /**
   * The value of the currently selected `Tab`.
   */
  value?: Value

  /**
   * When set to true allows the tab bar to scroll horizontally.
   * @default false
   */
  scrollable?: boolean

  /**
   * Callback fired when the value changes.
   */
  onChange?: OnChange<Value>

  /**
   * Determines the bounces of tab list.
   */
  bounces?: ScrollViewProps['bounces']

  /**
   * Determines the overScrollMode of tab list.
   */
  overScrollMode?: ScrollViewProps['overScrollMode']

  /**
   * Determines the estimated tab width.
   * @default 0
   */
  estimatedTabWidth?: number

  /**
   * The initial window size. It is used to determine the sizes and positions of the tabs and the indicator.
   * @default Dimensions.get('window').width
   */
  initialLayoutWidth?: number

  /**
   * Background color to be applied when the tab is pressed.
   */
  pressColor?: ColorValue

  /**
   * Opacity to be applied when the tab is pressed.
   */
  pressOpacity?: number

  /**
   * Determines the opacity of disabled.
   */
  disabledOpacity?: number

  /**
   * Determines the tab gap.
   * @default 0
   */
  tabGap?: number

  /**
   * Determines the style of the tab.
   */
  tabStyle?: StyleProp<ViewStyle>

  /**
   * Determines the style of the tab label.
   */
  labelStyle?: StyleProp<TextStyle>

  /**
   * Render the custom tab item.
   */
  renderTabItem?: RenderTabItem<Value>

  /**
   * Render the tab icon to display.
   */
  renderTabIcon?: RenderTabIcon<Value>

  /**
   * Render the tab label to display.
   */
  renderTabLabel?: RenderTabLabel<Value>

  /**
   * Render the tab badge to display.
   */
  renderTabBadge?: RenderTabBadge<Value>

  /**
   * Callback fired when the tab pressed.
   */
  onTabPress?: OnTabPress<Value>

  /**
   * Callback fired when the tab long pressed.
   */
  onTabLongPress?: OnTabLongPress<Value>

  /**
   * Animated position value.
   */
  animatedPosition?: SharedValue<number>

  /**
   * Determines the animation config of the indicator.
   */
  animationConfig?: WithTimingConfig

  /**
   * Render the tabs indicator to display.
   */
  renderIndicator?: RenderTabsIndicator

  /**
   * Determines the style of the indicator.
   */
  indicatorStyle?: StyleProp<ViewStyle>

  /**
   * The indicator determines its enabled.
   * @default true
   */
  indicatorEnabled?: boolean

  /**
   * The component used to render the tabs.
   */
  tabComponent?: React.ComponentType<TabButtonProps>

  /**
   * Determines the style of the `ScrollView` content container.
   */
  contentContainerStyle?: StyleProp<ViewStyle>
}

const Separator: React.FC<{ width: number }> = ({ width }) => (
  <View style={{ width }} />
)

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

const getComputedTabWidth = ({
  index,
  tabs,
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
  tabs: TabItem[]
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

  const totalGapWidth = (tabGap ?? 0) * Math.max(0, tabs.length - 1)
  const totalPadding = calculateTotalPadding({
    layoutWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight
  })

  return (layoutWidth - totalGapWidth - totalPadding) / tabs.length
}

const getFlattenedWidth = (style: StyleProp<ViewStyle>) => {
  const tabStyle = StyleSheet.flatten(style)
  return tabStyle?.width
}

const getInitialItemsLayout = ({
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
    tabs,
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

const getFlattenedPaddingValues = (style: StyleProp<ViewStyle>) => {
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

const defaultIndicator: RenderTabsIndicator = (props) => (
  <TabsIndicator {...props} />
)

const defaultAnimationConfig: WithTimingConfig = {
  duration: 300,
  easing: Easing.bezier(0.4, 0, 0.2, 1)
}

const Tabs = <Value extends TabValue = TabValue>(props: TabsProps<Value>) => {
  const {
    tabs,
    style,
    value,
    tabGap = 0,
    scrollable = false,
    onChange,
    onTabPress,
    onTabLongPress,
    bounces,
    overScrollMode,
    renderTabItem,
    renderTabIcon,
    renderTabLabel,
    renderTabBadge,
    tabStyle,
    labelStyle,
    animatedPosition,
    animationConfig = defaultAnimationConfig,
    renderIndicator = defaultIndicator,
    indicatorStyle,
    indicatorEnabled = true,
    tabComponent,
    contentContainerStyle,
    pressColor,
    pressOpacity,
    disabledOpacity,
    estimatedTabWidth = 0,
    initialLayoutWidth = Dimensions.get('window').width
  } = props

  const tabIndex = tabs.findIndex((tab) => value === tab.value)
  const scrollEnabled = scrollable
  const flattenedTabWidth = getFlattenedWidth(tabStyle)
  const isDynamicWidth = flattenedTabWidth === 'auto'
  const { left: flattenedPaddingLeft, right: flattenedPaddingRight } =
    getFlattenedPaddingValues(contentContainerStyle)
  const hasProvidedAnimatedPosition = animatedPosition !== undefined

  const position = useReactiveSharedValue(animatedPosition || (-1 as number))
  const scrollOffsetX = useSharedValue(0)
  const currentPositionToSync = useSharedValue(position.value)
  const targetPositionToSync = useSharedValue(position.value)
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>()
  const mountedRef = React.useRef(false)
  const itemsLayoutRef = React.useRef(new Map<TabValue, TabItemLayout>())
  const [layoutWidth, setLayoutWidth] = React.useState(initialLayoutWidth)
  const [itemsLayout, setItemsLayout] = React.useState<TabItemLayout[]>(
    isDynamicWidth
      ? []
      : getInitialItemsLayout({
          tabs,
          tabGap,
          layoutWidth,
          scrollEnabled,
          estimatedTabWidth,
          flattenedTabWidth,
          flattenedPaddingLeft,
          flattenedPaddingRight
        })
  )

  if (__DEV__ && tabIndex === -1) {
    const values = tabs.map((tab) => tab.value).join(', ')

    console.warn(
      '[mui-tabs]',
      [
        'The `value` provided to the Tabs component is invalid.',
        `None of the Tabs match with "${value}" value.`,
        `You can provide one of the following values: ${values}.`
      ].join('\n')
    )
  }

  const getTabWidth = React.useCallback(
    (index: number) => {
      'worklet'
      return getComputedTabWidth({
        index,
        tabs,
        tabGap,
        itemsLayout,
        layoutWidth,
        scrollEnabled,
        estimatedTabWidth,
        flattenedTabWidth,
        flattenedPaddingLeft,
        flattenedPaddingRight
      })
    },
    [
      tabs,
      tabGap,
      itemsLayout,
      layoutWidth,
      scrollEnabled,
      estimatedTabWidth,
      flattenedTabWidth,
      flattenedPaddingLeft,
      flattenedPaddingRight
    ]
  )

  const updateItemsLayout = React.useCallback((layout: TabItemLayout[]) => {
    setItemsLayout((prevLayout) => {
      if (isEqual(layout, prevLayout)) {
        return prevLayout
      }

      return layout
    })
  }, [])

  const animateToPosition = React.useCallback(
    (nextPosition: number, callback?: AnimationCallback) => {
      'worklet'
      position.value = withTiming(nextPosition, animationConfig, callback)
    },
    [position, animationConfig]
  )

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffsetX.value = event.contentOffset.x
    }
  })

  const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
    const {
      nativeEvent: { layout }
    } = event

    setLayoutWidth((prevLayoutWidth) => {
      if (layout.width === prevLayoutWidth) {
        return prevLayoutWidth
      }

      return layout.width
    })
  }, [])

  const renderTab = (item: TabItem<Value>, index: number) => {
    if (item.value == null) {
      throw new TypeError(`[mui-tabs] Tab [${index}] value not provided.`)
    }

    const { value: tabItemValue, disabled } = item
    const selected = value === tabItemValue

    const tabItemProps: TabProps<Value> = {
      item,
      tabWidth: !isDynamicWidth ? getTabWidth(index) : undefined,
      style: tabStyle,
      selected,
      disabled,
      labelStyle,
      pressColor,
      pressOpacity,
      disabledOpacity,
      renderIcon: renderTabIcon,
      renderLabel: renderTabLabel,
      renderBadge: renderTabBadge,
      onPress: () => {
        const event: ChangeEvent<Value> = {
          item,
          defaultPrevented: false,
          preventDefault() {
            event.defaultPrevented = true
          }
        }

        if (onTabPress) {
          runOnJS(onTabPress)(event)
        }

        if (onChange && !selected && !event.defaultPrevented) {
          runOnJS(onChange)(tabItemValue, event)
        }
      },
      onLongPress: onTabLongPress
        ? () => runOnJS(onTabLongPress)({ item, index })
        : undefined,
      onLayout: isDynamicWidth
        ? (event) => {
            const {
              nativeEvent: { layout: layoutRect }
            } = event

            itemsLayoutRef.current.set(tabItemValue, {
              x: layoutRect.x,
              width: layoutRect.width
            })

            const layout = Array.from(itemsLayoutRef.current)
              .filter(([tabValue]) =>
                tabs.some((tab) => tabValue === tab.value)
              )
              .map(([, itemLayout]) => itemLayout)
              .sort((a, b) => a.x - b.x)

            if (tabs.length === layout.length) {
              updateItemsLayout(layout)
            }
          }
        : undefined,
      buttonComponent: tabComponent
    }

    return (
      <React.Fragment key={tabItemValue}>
        {tabGap > 0 && index > 0 ? <Separator width={tabGap} /> : null}
        {renderTabItem ? (
          renderTabItem(tabItemProps)
        ) : (
          <Tab {...tabItemProps} />
        )}
      </React.Fragment>
    )
  }

  useAnimatedReaction(
    () => position.value,
    (nextPosition) => {
      cancelAnimation(currentPositionToSync)
      targetPositionToSync.value = nextPosition
      currentPositionToSync.value = withTiming(nextPosition, animationConfig)
    }
  )

  useAnimatedReaction(
    () => currentPositionToSync.value === targetPositionToSync.value,
    (canSync) => {
      const itemLayout = itemsLayout[position.value]

      if (scrollEnabled && canSync && itemLayout) {
        const offset = itemLayout.x
        const halfTab = itemLayout.width / 2

        if (
          offset < scrollOffsetX.value ||
          offset > scrollOffsetX.value + layoutWidth - 2 * halfTab
        ) {
          scrollTo(scrollViewRef, offset - layoutWidth / 2 + halfTab, 0, true)
        }
      }
    },
    [itemsLayout, layoutWidth, scrollEnabled]
  )

  React.useEffect(() => {
    if (tabIndex === -1 || !indicatorEnabled || hasProvidedAnimatedPosition) {
      return
    }

    cancelAnimation(position)
    runOnUI(animateToPosition)(tabIndex)
  }, [
    position,
    tabIndex,
    animateToPosition,
    indicatorEnabled,
    hasProvidedAnimatedPosition
  ])

  React.useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
    } else if (!isDynamicWidth) {
      updateItemsLayout(
        getInitialItemsLayout({
          tabs,
          tabGap,
          layoutWidth,
          scrollEnabled,
          estimatedTabWidth,
          flattenedTabWidth,
          flattenedPaddingLeft,
          flattenedPaddingRight
        })
      )
    }
  }, [
    tabs,
    tabGap,
    layoutWidth,
    scrollEnabled,
    updateItemsLayout,
    isDynamicWidth,
    flattenedTabWidth,
    estimatedTabWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight
  ])

  return (
    <Animated.View style={[styles.container, style]} onLayout={handleLayout}>
      <Animated.ScrollView
        ref={scrollViewRef}
        bounces={bounces}
        horizontal={true}
        scrollsToTop={false}
        onScroll={scrollEnabled ? handleScroll : undefined}
        scrollEnabled={scrollEnabled}
        overScrollMode={overScrollMode}
        accessibilityRole="tablist"
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        contentContainerStyle={contentContainerStyle}
        alwaysBounceHorizontal={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustsScrollIndicatorInsets={false}
      >
        {tabs.map(renderTab)}

        {indicatorEnabled
          ? renderIndicator({
              tabs,
              tabGap,
              position,
              style: [
                indicatorStyle,
                {
                  left: flattenedPaddingLeft,
                  right: flattenedPaddingRight
                }
              ],
              getTabWidth
            })
          : null}
      </Animated.ScrollView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'scroll'
  }
})

export default Tabs
