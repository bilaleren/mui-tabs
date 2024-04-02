import * as React from 'react'
import {
  View,
  Easing,
  Animated,
  Dimensions,
  StyleSheet,
  StyleProp,
  ViewToken,
  TextStyle,
  ViewStyle,
  ColorValue,
  DimensionValue,
  ScrollViewProps,
  LayoutChangeEvent,
  ListRenderItemInfo
} from 'react-native'
import Tab from '../Tab'
import TabsIndicator from '../TabsIndicator'
import { dequal as isEqual } from 'dequal/lite'
import useLatestCallback from 'use-latest-callback'
import useAnimatedValue from '@utils/useAnimatedValue'
import type { TabButtonProps } from '../TabButton'
import type {
  TabItem,
  TabValue,
  OnChange,
  OnTabPress,
  ChangeEvent,
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
   * An indicator to show if tabs are working within the tab view.
   */
  $tabView?: boolean

  /**
   * Determines the style of the tab.
   */
  tabStyle?: StyleProp<ViewStyle>

  /**
   * Determines the style of the tab label.
   */
  labelStyle?: StyleProp<TextStyle>

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
   * Current position interpolation value.
   */
  position?: Animated.AnimatedInterpolation<number>

  /**
   * https://github.com/bilaleren/mui-tabs/blob/master/KNOWN_ISSUES.md#indicator-does-not-move-during-scrolling
   * @default false
   */
  forceUpdateScrollAmountValue?: boolean

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
   * Determines the style of the indicator container.
   */
  indicatorContainerStyle?: StyleProp<ViewStyle>

  /**
   * The component used to render the tabs.
   */
  tabComponent?: React.ComponentType<TabButtonProps>

  /**
   * Determines the style of the `FlatList` content container.
   */
  contentContainerStyle?: StyleProp<ViewStyle>
}

const Separator: React.FC<{ width: number }> = ({ width }) => (
  <View style={{ width }} />
)

const MEASURE_PER_BATCH = 10

const getTabsWidth = ({
  tabs,
  tabGap,
  tabWidths,
  layoutWidth,
  scrollEnabled,
  estimatedTabWidth,
  flattenedTabWidth,
  flattenedPaddingLeft,
  flattenedPaddingRight
}: {
  tabs: TabItem[]
  tabGap: number
  tabWidths: Record<TabValue, number>
  layoutWidth: number
  scrollEnabled: boolean
  estimatedTabWidth: number
  flattenedTabWidth: DimensionValue | undefined
  flattenedPaddingLeft: DimensionValue | undefined
  flattenedPaddingRight: DimensionValue | undefined
}) => {
  const totalPadding = Math.max(
    0,
    convertPercentToSize(flattenedPaddingLeft, layoutWidth) +
      convertPercentToSize(flattenedPaddingRight, layoutWidth)
  )

  return tabs.reduce<number>(
    (total, _, index) =>
      total +
      (index > 0 ? tabGap ?? 0 : 0) +
      getComputedTabWidth({
        index,
        tabs,
        tabGap,
        tabWidths,
        layoutWidth,
        scrollEnabled,
        estimatedTabWidth,
        flattenedWidth: flattenedTabWidth,
        flattenedPaddingLeft,
        flattenedPaddingRight
      }),
    totalPadding
  )
}

const normalizeScrollValue = ({
  tabs,
  tabGap,
  tabWidths,
  scrollValue,
  layoutWidth,
  scrollEnabled,
  estimatedTabWidth,
  flattenedTabWidth,
  flattenedPaddingLeft,
  flattenedPaddingRight
}: {
  tabs: TabItem[]
  tabGap: number
  tabWidths: Record<TabValue, number>
  scrollValue: number
  layoutWidth: number
  scrollEnabled: boolean
  estimatedTabWidth: number
  flattenedTabWidth: DimensionValue | undefined
  flattenedPaddingLeft: DimensionValue | undefined
  flattenedPaddingRight: DimensionValue | undefined
}) => {
  const tabsWidth = getTabsWidth({
    tabs,
    tabGap,
    tabWidths,
    layoutWidth,
    scrollEnabled,
    estimatedTabWidth,
    flattenedTabWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight
  })

  const maxDistance = getMaxScrollDistance(tabsWidth, layoutWidth)

  return Math.max(Math.min(scrollValue, maxDistance), 0)
}

const getScrollAmount = ({
  tabs,
  tabGap,
  tabIndex,
  tabWidths,
  layoutWidth,
  scrollEnabled,
  estimatedTabWidth,
  flattenedTabWidth,
  flattenedPaddingLeft,
  flattenedPaddingRight
}: {
  tabGap: number
  tabs: TabItem[]
  tabIndex: number
  tabWidths: Record<TabValue, number>
  layoutWidth: number
  scrollEnabled: boolean
  estimatedTabWidth: number
  flattenedTabWidth: DimensionValue | undefined
  flattenedPaddingLeft: DimensionValue | undefined
  flattenedPaddingRight: DimensionValue | undefined
}) => {
  const initialPadding = convertPercentToSize(flattenedPaddingLeft, layoutWidth)
  const centerDistance = Array.from({ length: tabIndex + 1 }).reduce<number>(
    (total, _, index) => {
      const tabWidth = getComputedTabWidth({
        index,
        tabs,
        tabGap,
        tabWidths,
        layoutWidth,
        scrollEnabled,
        estimatedTabWidth,
        flattenedWidth: flattenedTabWidth,
        flattenedPaddingLeft,
        flattenedPaddingRight
      })

      return (
        total +
        (index > 0 ? tabGap ?? 0 : 0) +
        (index === tabIndex ? tabWidth / 2 : tabWidth)
      )
    },
    initialPadding
  )
  const scrollAmount = centerDistance - layoutWidth / 2

  return normalizeScrollValue({
    tabs,
    tabGap,
    tabWidths,
    layoutWidth,
    scrollEnabled,
    scrollValue: scrollAmount,
    estimatedTabWidth,
    flattenedTabWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight
  })
}

const getComputedTabWidth = ({
  index,
  tabs,
  tabGap,
  tabWidths,
  layoutWidth,
  scrollEnabled,
  estimatedTabWidth,
  flattenedWidth,
  flattenedPaddingLeft,
  flattenedPaddingRight
}: {
  index: number
  tabs: TabItem[]
  tabGap: number
  tabWidths: Record<TabValue, number>
  layoutWidth: number
  scrollEnabled: boolean
  estimatedTabWidth: number
  flattenedWidth: DimensionValue | undefined
  flattenedPaddingLeft: DimensionValue | undefined
  flattenedPaddingRight: DimensionValue | undefined
}): number => {
  if (flattenedWidth === 'auto') {
    return tabWidths[tabs[index]?.value] ?? estimatedTabWidth
  } else if (flattenedWidth != null) {
    return convertPercentToSize(flattenedWidth, layoutWidth)
  } else if (scrollEnabled) {
    return (layoutWidth / 5) * 2
  }

  const totalGapWidth = (tabGap ?? 0) * Math.max(0, tabs.length - 1)
  const totalPadding =
    convertPercentToSize(flattenedPaddingLeft, layoutWidth) +
    convertPercentToSize(flattenedPaddingRight, layoutWidth)

  return (layoutWidth - totalGapWidth - totalPadding) / tabs.length
}

const getMaxScrollDistance = (tabsWidth: number, layoutWidth: number): number =>
  tabsWidth - layoutWidth

const isMeasuredTabWidths = (
  tabs: TabItem[],
  tabWidths: Record<TabValue, number>
): boolean => {
  return tabs.every((t) => typeof tabWidths[t.value] === 'number')
}

const convertPercentToSize = (
  value: DimensionValue | undefined,
  layoutWidth: number
): number => {
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

const getFlattenedTabWidth = (style: StyleProp<ViewStyle>) => {
  const tabStyle = StyleSheet.flatten(style)
  return tabStyle?.width
}

const getFlattenedPaddingLeft = (style: StyleProp<ViewStyle>) => {
  const flattenStyle = StyleSheet.flatten(style)

  return flattenStyle
    ? flattenStyle.paddingLeft || flattenStyle.paddingHorizontal || 0
    : 0
}

const getFlattenedPaddingRight = (style: StyleProp<ViewStyle>) => {
  const flattenStyle = StyleSheet.flatten(style)

  return flattenStyle
    ? flattenStyle.paddingRight || flattenStyle.paddingHorizontal || 0
    : 0
}

const defaultIndicator: RenderTabsIndicator = (props) => (
  <TabsIndicator {...props} />
)

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
    renderTabIcon,
    renderTabLabel,
    renderTabBadge,
    tabStyle,
    labelStyle,
    position: positionProp,
    renderIndicator = defaultIndicator,
    indicatorStyle,
    indicatorEnabled = true,
    indicatorContainerStyle,
    tabComponent,
    contentContainerStyle,
    pressColor,
    pressOpacity,
    disabledOpacity,
    estimatedTabWidth = 0,
    initialLayoutWidth = Dimensions.get('window').width,
    forceUpdateScrollAmountValue,
    $tabView
  } = props

  const tabIndex = tabs.findIndex((tab) => value === tab.value)
  const scrollEnabled = scrollable
  const flattenedTabWidth = getFlattenedTabWidth(tabStyle)
  const isDynamicWidth = flattenedTabWidth === 'auto'
  const flattenedPaddingRight = getFlattenedPaddingRight(contentContainerStyle)
  const flattenedPaddingLeft = getFlattenedPaddingLeft(contentContainerStyle)

  const position = useAnimatedValue(0)
  const scrollAmount = useAnimatedValue(0)
  const mountedRef = React.useRef<boolean>(false)
  const flatListRef = React.useRef<Animated.FlatList>(null)
  const [layoutWidth, setLayoutWidth] = React.useState(initialLayoutWidth)
  const [tabWidths, setTabWidths] = React.useState<Record<TabValue, number>>({})
  const measuredTabWidths = React.useRef<Record<TabValue, number>>({})

  const hasProvidedPosition = positionProp !== undefined

  const hasMeasuredTabWidths =
    tabIndex > -1 &&
    layoutWidth > 0 &&
    isMeasuredTabWidths(tabs.slice(0, tabIndex), tabWidths)

  const tabsWidth = getTabsWidth({
    tabs,
    tabGap,
    tabWidths,
    layoutWidth,
    scrollEnabled,
    estimatedTabWidth,
    flattenedTabWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight
  })

  const scrollOffset =
    tabIndex > -1
      ? getScrollAmount({
          tabs,
          tabGap,
          tabWidths,
          tabIndex,
          layoutWidth,
          scrollEnabled,
          estimatedTabWidth,
          flattenedTabWidth,
          flattenedPaddingLeft,
          flattenedPaddingRight
        })
      : null

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

  React.useEffect(() => {
    if (tabIndex === -1 || !indicatorEnabled || hasProvidedPosition) {
      return
    }

    if (mountedRef.current) {
      Animated.timing(position, {
        toValue: tabIndex,
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: false
      }).start()
    } else {
      position.setValue(tabIndex)
    }
  }, [position, tabIndex, hasProvidedPosition, indicatorEnabled])

  React.useEffect(() => {
    if (!mountedRef.current || (isDynamicWidth && !hasMeasuredTabWidths)) {
      return
    }

    let timer: NodeJS.Timeout

    const scrollToOffset = (): void => {
      const flatList = flatListRef.current

      if (flatList && scrollEnabled && scrollOffset !== null) {
        flatList.scrollToOffset({
          offset: scrollOffset,
          animated: true
        })
      }
    }

    if (!$tabView) {
      timer = setTimeout(scrollToOffset, 130)
    } else {
      scrollToOffset()
    }

    return () => clearTimeout(timer)
  }, [
    $tabView,
    scrollOffset,
    scrollEnabled,
    isDynamicWidth,
    hasMeasuredTabWidths
  ])

  React.useEffect(() => {
    if (
      forceUpdateScrollAmountValue &&
      !mountedRef.current &&
      scrollEnabled &&
      indicatorEnabled
    ) {
      scrollAmount.setValue(0)
    }
  }, [
    scrollAmount,
    scrollEnabled,
    indicatorEnabled,
    forceUpdateScrollAmountValue
  ])

  React.useEffect(() => {
    mountedRef.current = true
  }, [])

  const keyExtractor = React.useCallback(
    (item: TabItem<Value>) => item.value.toString(),
    []
  )

  const updateTabWidths = React.useCallback((tabs: TabItem<Value>[]) => {
    const measuredWidths = tabs.reduce<Record<TabValue, number>>(
      (acc, curr) => ({
        ...acc,
        [curr.value]: measuredTabWidths.current[curr.value] || 0
      }),
      {}
    )

    setTabWidths((prevState) => {
      if (isEqual(prevState, measuredWidths)) {
        return prevState
      }

      return { ...measuredWidths }
    })
  }, [])

  const handleScroll = React.useMemo(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { x: scrollAmount }
            }
          }
        ],
        { useNativeDriver: true }
      ),
    [scrollAmount]
  )

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

  const handleViewableItemsChanged = useLatestCallback(
    ({ changed }: { changed: ViewToken[] }) => {
      if (tabs.length <= MEASURE_PER_BATCH) {
        return
      }

      const item = changed[changed.length - 1]

      if (!item) {
        return
      }

      const index = item.index || 0

      if (
        item.isViewable &&
        (index % 10 === 0 || index === tabIndex || index === tabs.length - 1)
      ) {
        updateTabWidths(tabs)
      }
    }
  )

  const renderItem = React.useCallback(
    ({ item, index }: ListRenderItemInfo<TabItem<Value>>) => {
      if (item.value == null) {
        throw new TypeError(`[mui-tabs] Tab [${index}] value not provided.`)
      }

      const { value: tabItemValue, disabled } = item
      const selected = value === tabItemValue

      return (
        <React.Fragment>
          {tabGap > 0 && index > 0 ? <Separator width={tabGap} /> : null}
          <Tab
            item={item}
            tabWidth={
              !isDynamicWidth
                ? getComputedTabWidth({
                    index,
                    tabs,
                    tabGap,
                    tabWidths,
                    layoutWidth,
                    scrollEnabled,
                    estimatedTabWidth,
                    flattenedWidth: flattenedTabWidth,
                    flattenedPaddingLeft,
                    flattenedPaddingRight
                  })
                : undefined
            }
            style={tabStyle}
            selected={selected}
            disabled={disabled}
            labelStyle={labelStyle}
            pressColor={pressColor}
            pressOpacity={pressOpacity}
            disabledOpacity={disabledOpacity}
            renderIcon={renderTabIcon}
            renderLabel={renderTabLabel}
            renderBadge={renderTabBadge}
            onPress={() => {
              const event: ChangeEvent<Value> = {
                item,
                defaultPrevented: false,
                preventDefault() {
                  event.defaultPrevented = true
                }
              }

              onTabPress?.(event)

              if (!selected && !event.defaultPrevented) {
                onChange?.(tabItemValue, event)
              }
            }}
            onLongPress={
              onTabLongPress ? () => onTabLongPress({ item }) : undefined
            }
            onLayout={
              isDynamicWidth
                ? (event) => {
                    const {
                      nativeEvent: { layout }
                    } = event

                    measuredTabWidths.current[tabItemValue] = layout.width

                    if (
                      tabs.length > MEASURE_PER_BATCH &&
                      index === MEASURE_PER_BATCH &&
                      isMeasuredTabWidths(
                        tabs.slice(0, MEASURE_PER_BATCH),
                        measuredTabWidths.current
                      )
                    ) {
                      updateTabWidths(tabs.slice(0, MEASURE_PER_BATCH))
                    } else if (
                      isMeasuredTabWidths(tabs, measuredTabWidths.current)
                    ) {
                      updateTabWidths(tabs)
                    }
                  }
                : undefined
            }
            buttonComponent={tabComponent}
          />
        </React.Fragment>
      )
    },
    [
      value,
      tabGap,
      isDynamicWidth,
      tabs,
      tabWidths,
      layoutWidth,
      scrollEnabled,
      estimatedTabWidth,
      flattenedTabWidth,
      flattenedPaddingLeft,
      flattenedPaddingRight,
      tabStyle,
      labelStyle,
      pressColor,
      pressOpacity,
      disabledOpacity,
      renderTabIcon,
      renderTabLabel,
      renderTabBadge,
      onTabLongPress,
      tabComponent,
      onTabPress,
      onChange,
      updateTabWidths
    ]
  )

  const memoizedContentContainerStyle = React.useMemo(
    () => [
      styles.contentContainer,
      scrollEnabled ? { width: tabsWidth } : null,
      contentContainerStyle
    ],
    [tabsWidth, scrollEnabled, contentContainerStyle]
  )

  return (
    <Animated.View
      style={[styles.container, scrollEnabled ? styles.scroll : null, style]}
      onLayout={handleLayout}
    >
      {indicatorEnabled && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            scrollEnabled
              ? {
                  transform: [
                    {
                      translateX: Animated.multiply(scrollAmount, -1)
                    }
                  ]
                }
              : null,
            scrollEnabled ? { width: tabsWidth } : null,
            indicatorContainerStyle
          ]}
          pointerEvents="none"
        >
          {renderIndicator({
            tabs,
            tabGap,
            position: positionProp || position,
            style: [
              indicatorStyle,
              {
                left: flattenedPaddingLeft,
                right: flattenedPaddingRight
              }
            ],
            getTabWidth: (index) =>
              getComputedTabWidth({
                index,
                tabs,
                tabGap,
                tabWidths,
                layoutWidth,
                scrollEnabled,
                estimatedTabWidth,
                flattenedWidth: flattenedTabWidth,
                flattenedPaddingLeft,
                flattenedPaddingRight
              })
          })}
        </Animated.View>
      )}

      <View style={!scrollEnabled ? styles.scroll : null}>
        <Animated.FlatList
          ref={flatListRef}
          data={tabs as Animated.WithAnimatedValue<TabItem<Value>>[]}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          bounces={bounces}
          horizontal={true}
          scrollsToTop={false}
          scrollEnabled={scrollEnabled}
          overScrollMode={overScrollMode}
          accessibilityRole="tablist"
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          initialNumToRender={MEASURE_PER_BATCH}
          onScroll={handleScroll}
          contentContainerStyle={memoizedContentContainerStyle}
          onViewableItemsChanged={handleViewableItemsChanged}
          alwaysBounceHorizontal={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          automaticallyAdjustsScrollIndicatorInsets={false}
        />
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  scroll: {
    overflow: 'scroll'
  },
  container: {
    zIndex: 1
  },
  contentContainer: {
    flexGrow: 1,
    flexWrap: 'nowrap',
    flexDirection: 'row'
  }
})

export default Tabs
