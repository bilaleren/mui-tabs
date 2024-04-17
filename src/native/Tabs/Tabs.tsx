import * as React from 'react'
import {
  View,
  StyleSheet,
  ColorValue,
  StyleProp,
  TextStyle,
  ViewStyle,
  ScrollViewProps,
  LayoutChangeEvent
} from 'react-native'
import Animated, {
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
  WithTimingConfig
} from 'react-native-reanimated'
import { WINDOW_DIM } from '../constants'
import { dequal as isEqual } from 'dequal/lite'
import Tab, { TabProps } from '../Tab'
import TabsIndicator from '../TabsIndicator'
import useAnimatableSharedValue from '@utils/useAnimatableSharedValue'
import {
  getScrollOffset,
  getFlattenedWidth,
  getComputedTabWidth,
  getInitialItemsLayout,
  getFlattenedPaddingValues
} from './utils'
import type { TabButtonProps } from '../TabButton'
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
   * Determines the overScrollMode of scroll view.
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
   * @default true
   */
  animationEnabled?: boolean

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
    renderTabItem,
    renderTabIcon,
    renderTabLabel,
    renderTabBadge,
    tabStyle,
    labelStyle,
    animatedPosition,
    animationEnabled = true,
    animationConfig,
    renderIndicator = defaultIndicator,
    indicatorStyle,
    indicatorEnabled = true,
    tabComponent,
    contentContainerStyle,
    pressColor,
    pressOpacity,
    disabledOpacity,
    estimatedTabWidth = 0,
    initialLayoutWidth = WINDOW_DIM.width
  } = props

  const tabIndex = tabs.findIndex((tab) => value === tab.value)
  const scrollEnabled = scrollable
  const flattenedTabWidth = getFlattenedWidth(tabStyle)
  const isDynamicWidth = flattenedTabWidth === 'auto'
  const { left: flattenedPaddingLeft, right: flattenedPaddingRight } =
    getFlattenedPaddingValues(contentContainerStyle)
  const hasProvidedAnimatedPosition = animatedPosition !== undefined

  const position = useAnimatableSharedValue(animatedPosition || tabIndex)
  const currentPositionToSync = useSharedValue(position.value)
  const targetPositionToSync = useSharedValue(position.value)
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>()
  const mountedRef = React.useRef(false)
  const itemsLayoutRef = React.useRef(new Map<TabValue, TabItemLayout>())
  const [layoutWidth, setLayoutWidth] = React.useState(initialLayoutWidth)
  const [itemsLayout, setItemsLayout] = React.useState<TabItemLayout[]>(
    isDynamicWidth
      ? Array.from({ length: tabs.length }).map((_, index) => ({
          x: index * estimatedTabWidth,
          width: estimatedTabWidth
        }))
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
    (index: number): number => {
      'worklet'

      return getComputedTabWidth({
        index,
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
    (nextPosition: number) => {
      'worklet'

      position.value = animationEnabled
        ? withTiming(nextPosition, animationConfig)
        : nextPosition
    },
    [position, animationConfig, animationEnabled]
  )

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      if (animationEnabled) {
        cancelAnimation(currentPositionToSync)
      }
    }
  })

  const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
    const {
      nativeEvent: { layout }
    } = event

    runOnJS(setLayoutWidth)((prevLayoutWidth) => {
      if (layout.width === prevLayoutWidth) {
        return prevLayoutWidth
      }

      return layout.width
    })
  }, [])

  const renderTab = (item: TabItem<Value>, index: number) => {
    if (item.value == null) {
      throw new TypeError(`[mui-tabs]: tabs[${index}].value not provided.`)
    }

    const { value: tabValue, disabled } = item
    const selected = value === tabValue

    const tabItemProps: TabProps<Value> = {
      item,
      index,
      tabWidth: !isDynamicWidth ? getTabWidth(index) : undefined,
      style: tabStyle,
      selected,
      disabled,
      pressColor,
      pressOpacity,
      disabledOpacity,
      labelStyle,
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
          runOnJS(onChange)(tabValue, event)
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

            itemsLayoutRef.current.set(tabValue, {
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
      <React.Fragment key={tabValue}>
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
      if (animationEnabled) {
        cancelAnimation(currentPositionToSync)
      }

      targetPositionToSync.value = nextPosition
      currentPositionToSync.value = animationEnabled
        ? withTiming(nextPosition, animationConfig)
        : nextPosition
    }
  )

  useAnimatedReaction(
    () => currentPositionToSync.value === targetPositionToSync.value,
    (canSync) => {
      if (canSync && scrollEnabled) {
        const scrollOffset = getScrollOffset({
          tabGap,
          position,
          itemsLayout,
          layoutWidth,
          estimatedTabWidth,
          flattenedTabWidth,
          flattenedPaddingLeft,
          flattenedPaddingRight
        })

        scrollTo(scrollViewRef, scrollOffset, 0, animationEnabled)
      }
    },
    [itemsLayout, layoutWidth, scrollEnabled, animationEnabled]
  )

  React.useEffect(() => {
    if (tabIndex === -1 || !indicatorEnabled || hasProvidedAnimatedPosition) {
      return
    }

    if (animationEnabled) {
      cancelAnimation(position)
    }

    runOnUI(animateToPosition)(tabIndex)
  }, [
    position,
    tabIndex,
    indicatorEnabled,
    animationEnabled,
    animateToPosition,
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
    isDynamicWidth,
    updateItemsLayout,
    flattenedTabWidth,
    estimatedTabWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight
  ])

  return (
    <Animated.View style={[styles.container, style]} onLayout={handleLayout}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={scrollEnabled ? scrollHandler : undefined}
        bounces={bounces}
        horizontal={true}
        scrollsToTop={false}
        scrollEnabled={scrollEnabled}
        overScrollMode={overScrollMode}
        accessibilityRole="tablist"
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        contentContainerStyle={contentContainerStyle}
        pinchGestureEnabled={false}
        alwaysBounceHorizontal={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustsScrollIndicatorInsets={false}
      >
        {tabs.map(renderTab)}

        {indicatorEnabled
          ? renderIndicator({
              itemsLayout,
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
