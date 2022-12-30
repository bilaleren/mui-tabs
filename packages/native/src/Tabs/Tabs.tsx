import * as React from 'react'
import {
  View,
  Text,
  Easing,
  Animated,
  Dimensions,
  ViewProps,
  TextProps,
  StyleSheet,
  ScrollView,
  ColorValue,
  I18nManager,
  ScrollViewProps,
  NativeScrollEvent,
  LayoutChangeEvent,
  NativeSyntheticEvent
} from 'react-native'
import type { TabProps } from '../Tab'
import type { TabValue, ChangeHandler } from '../types'
import TabButton, { TabButtonProps } from '../TabButton'
import flattenSize from '@mui-tabs/utils/src/flattenSize'
import isReactFragment from '@mui-tabs/utils/src/isReactFragment'
import useEventCallback from '@mui-tabs/utils/src/useEventCallback'
import TabScrollButton, { TabScrollButtonProps } from './TabScrollButton'
import { DEFAULT_TAB_WIDTH, DEFAULT_SCROLL_BUTTON_WIDTH } from '../constants'

export type IndicatorAnimationConfig<
  T extends Record<'toValue' | 'useNativeDriver', unknown>
> = Omit<T, 'toValue' | 'useNativeDriver'>

export type IndicatorTimingAnimationConfig =
  IndicatorAnimationConfig<Animated.TimingAnimationConfig>

export type IndicatorSpringAnimationConfig =
  IndicatorAnimationConfig<Animated.SpringAnimationConfig>

export interface IndicatorAnimationConfigMap {
  timing: IndicatorTimingAnimationConfig
  spring: IndicatorSpringAnimationConfig
}

export type IndicatorAnimationType = keyof IndicatorAnimationConfigMap

export interface IndicatorAnimationOptions<
  AnimationType extends IndicatorAnimationType
> {
  type?: AnimationType
  config?: IndicatorAnimationConfigMap[AnimationType]
}

export interface IndicatorProps<AnimationType extends IndicatorAnimationType>
  extends ViewProps {
  /**
   * The indicator determines its height.
   * @default 2
   */
  size?: number | string

  /**
   * The indicator determines its animation.
   * @see https://reactnative.dev/docs/animated#timing
   * @see https://reactnative.dev/docs/animated#spring
   */
  animation?: IndicatorAnimationOptions<AnimationType>

  /**
   * The indicator determines its color.
   * @default #1976D2
   */
  color?: ColorValue

  /**
   * The indicator determines its position.
   * @default bottom
   */
  position?: 'top' | 'bottom'

  /**
   * The indicator determines its visibility.
   * @default true
   */
  visibility?: boolean
}

export interface TabsProps<
  Value extends TabValue = number,
  AnimationType extends IndicatorAnimationType = 'timing'
> extends ViewProps {
  /**
   * The value of the currently selected `Tab`.
   */
  value?: Value

  /**
   * Horizontal padding values applied to scrollViewProps.contentContainerStyle or scrollViewContainerProps.style.
   * @default 0
   */
  insets?: number

  /**
   * Applies marginLeft to all other tabs except the first tab.
   * @default 0
   */
  tabSpace?: number

  /**
   *  Determines additional display behavior of the tabs:
   *
   *  - `scrollable` will invoke scrolling properties and allow for horizontally
   *  scrolling (or swiping) of the tab bar.
   *  - `fullWidth` will make the tabs grow to use all the available space,
   *  which should be used for small views, like on mobile.
   *  - `standard` will render the default state.
   * @default 'standard'
   */
  variant?: 'scrollable' | 'standard' | 'fullWidth'

  /**
   * Callback fired when the value changes.
   */
  onChange?: ChangeHandler<Value>

  /**
   * If `true`, the tabs are centered.
   * This prop is intended for large views.
   * @default false
   */
  centered?: boolean

  /**
   * Determine behavior of scroll buttons when tabs are set to scroll.
   * @default false
   */
  scrollButtons?: boolean

  /**
   * The initial window size. It is used to determine the sizes and positions of the tabs and the indicator.
   * @default Dimensions.get('window').width
   */
  initialLayoutSize?: number

  /**
   * Override the Tab props.
   */
  tabProps?: Omit<
    Partial<TabProps>,
    'selected' | 'label' | 'fullWidth' | 'onChange'
  >

  /**
   * Override the Indicator props.
   */
  indicatorProps?: IndicatorProps<AnimationType>

  /**
   * Override the ScrollView props.
   */
  scrollViewProps?: Omit<
    Partial<ScrollViewProps>,
    | 'horizontal'
    | 'scrollsToTop'
    | 'showsVerticalScrollIndicator'
    | 'showsHorizontalScrollIndicator'
  >

  /**
   * The component used to render the tabs.
   */
  TabComponent?: React.ComponentType<TabButtonProps>

  /**
   * The component used to render the tabs label.
   */
  TabLabelComponent?: React.ComponentType<TextProps>

  /**
   * The component used to render the scroll buttons.
   */
  ScrollButtonComponent?: React.ComponentType<TabButtonProps>

  /**
   * Override the ScrollButtons props.
   */
  scrollButtonsProps?: Partial<TabScrollButtonProps>

  /**
   * Override the ScrollViewContainer props.
   */
  scrollViewContainerProps?: Partial<ViewProps>
}

const windowDimensions = Dimensions.get('window')

export interface TabsRefAttributes {
  scrollView: ScrollView | null
  updateIndicator(): void
  updateScrollButtons(): void
}

function getIndicatorAnimationOptions(
  options: undefined | IndicatorAnimationOptions<IndicatorAnimationType>
): Required<IndicatorAnimationOptions<IndicatorAnimationType>> {
  const { type = 'timing', config = {} } = options || {}

  return {
    type,
    config:
      type === 'timing'
        ? {
            delay: 0,
            duration: 300,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            ...config
          }
        : config
  }
}

interface TabsWithForwardRef
  extends React.ForwardRefExoticComponent<TabsProps> {
  <
    Value extends TabValue = number,
    AnimationType extends IndicatorAnimationType = 'timing'
  >(
    props: TabsProps<Value, AnimationType> &
      React.RefAttributes<TabsRefAttributes>
  ): ReturnType<React.FC<TabsProps<Value, AnimationType>>>
}

const Tabs: TabsWithForwardRef = React.forwardRef<TabsRefAttributes, TabsProps>(
  (props, ref) => {
    const {
      value,
      style,
      onChange,
      onLayout,
      centered = false,
      variant = 'standard',
      tabProps = {},
      insets = 0,
      tabSpace = 0,
      indicatorProps = {},
      scrollButtons = false,
      scrollViewProps = {},
      initialLayoutSize = windowDimensions.width,
      scrollButtonsProps = {},
      scrollViewContainerProps = {},
      children: childrenProp,
      TabComponent = TabButton,
      TabLabelComponent = Text,
      ScrollButtonComponent = TabButton,
      ...other
    } = props

    const {
      onScroll,
      scrollEnabled = true,
      onContentSizeChange,
      contentContainerStyle,
      ...otherScrollViewProps
    } = scrollViewProps
    const fullWidth = variant === 'fullWidth'
    const scrollable = variant === 'scrollable' && scrollEnabled
    const showScrollButtons = scrollable && scrollButtons

    const {
      size: indicatorSizeProp = 2,
      color: indicatorColorProp = '#1976D2',
      position: indicatorPositionProp = 'bottom',
      visibility: indicatorVisibility = true,
      animation: indicatorAnimationProp,
      ...otherIndicatorProps
    } = indicatorProps

    const getInitialLayoutSize = React.useCallback((): number => {
      if (!style) {
        return initialLayoutSize
      }

      const flattenedStyle = StyleSheet.flatten(style)
      const flattenedWidth = flattenSize(
        flattenedStyle.width,
        initialLayoutSize
      )

      return flattenedWidth || initialLayoutSize
    }, [style, initialLayoutSize])

    const childrenArray = React.Children.toArray(childrenProp).filter(
      (child) => {
        if (!React.isValidElement(child)) {
          return false
        }

        if (isReactFragment(child)) {
          if (__DEV__) {
            console.error(
              [
                "The Tabs component doesn't accept a Fragment as a child.",
                'Consider providing an array instead.'
              ].join('\n')
            )
          }

          return false
        }

        return true
      }
    ) as React.ReactElement<TabProps>[]

    const [layoutSize, setLayoutSize] =
      React.useState<number>(getInitialLayoutSize)
    const [mounted, setMounted] = React.useState(false)
    const [displayScroll, setDisplayScroll] = React.useState({
      start: false,
      end: false
    })

    const mountedRef = React.useRef(false)
    const animatedRef = React.useRef(false)
    const scrollViewRef = React.useRef<ScrollView>(null)
    const valueToSizeRef = React.useRef(new Map<TabValue, number>())
    const valueToIndexRef = React.useRef(new Map<TabValue, number>())
    const scrollPositionRef = React.useRef<number>(0)
    const indicatorWidth = React.useRef(new Animated.Value(0)).current
    const indicatorPosition = React.useRef(new Animated.Value(0)).current

    const getScrollButtonSize = React.useCallback((): number => {
      if (!showScrollButtons) {
        return 0
      }

      if (!scrollButtonsProps.style) {
        return DEFAULT_SCROLL_BUTTON_WIDTH
      }

      const flattenedStyle = StyleSheet.flatten(scrollButtonsProps.style)

      return (
        flattenSize(flattenedStyle.width, layoutSize) ||
        DEFAULT_SCROLL_BUTTON_WIDTH
      )
    }, [layoutSize, showScrollButtons, scrollButtonsProps.style])

    const getTabCoordinate = React.useCallback(
      (index: number): number => {
        let sizes: number[]
        const values = Array.from(valueToSizeRef.current.values()).slice(
          0,
          childrenArray.length
        )

        if (I18nManager.isRTL) {
          sizes = values.slice(index)
        } else {
          sizes = values.slice(0, index + 1)
        }

        return sizes.reduce<number>((previousValue, currentValue) => {
          previousValue += currentValue

          return previousValue
        }, 0)
      },
      [childrenArray.length]
    )

    const getScrollableAreaContentWidth = React.useCallback((): number => {
      return Array.from(valueToSizeRef.current.values())
        .slice(0, childrenArray.length)
        .reduce<number>((previousValue, currentValue) => {
          previousValue += currentValue

          return previousValue
        }, insets)
    }, [insets, childrenArray.length])

    const getScrollableAreaNextContentWidth = React.useCallback(
      (index: number): number => {
        return Array.from(valueToSizeRef.current.values())
          .slice(0, childrenArray.length)
          .slice(index)
          .reduce<number>((previousValue, currentValue) => {
            previousValue += currentValue

            return previousValue
          }, 0)
      },
      [childrenArray.length]
    )

    const getScrollableAreaWidth = (): number => {
      let width = layoutSize

      if (showScrollButtons) {
        width -= getScrollButtonSize() * 2
      }

      width -= insets

      return width
    }

    const calculateTabSize = (tab: TabProps): number => {
      if (fullWidth) {
        return getScrollableAreaWidth() / childrenArray.length
      }

      const flattenedSize = flattenSize(
        tab.width ?? tabProps.width,
        getScrollableAreaWidth()
      )

      return flattenedSize || DEFAULT_TAB_WIDTH
    }

    const scroll = (delta: number, animated?: boolean): void => {
      const scrollView = scrollViewRef.current

      if (!scrollView) {
        return
      }

      scrollView.scrollTo({
        x: delta,
        animated
      })
    }

    const moveTabsScroll = (delta: number, animated = true) => {
      scrollPositionRef.current += delta * (I18nManager.isRTL ? -1 : 1)

      scroll(scrollPositionRef.current, animated)
    }

    const scrollSelectedIntoView = useEventCallback((animated?: boolean) => {
      let index = valueToIndexRef.current.get(value as number)

      if (scrollable && index !== undefined) {
        const tabCoordinate = getTabCoordinate(index)
        const scrollableAreaWidth = getScrollableAreaWidth()

        if (I18nManager.isRTL) {
          index = childrenArray.length - 1 - index
        }

        const calculatedSpace = index * tabSpace

        const delta = Math.ceil(
          tabCoordinate - scrollableAreaWidth + insets + calculatedSpace
        )

        scroll(delta, animated)
      }
    })

    const updateIndicatorState = useEventCallback((animated?: boolean) => {
      if (!childrenArray.length) {
        return
      }

      const valueToSize = valueToSizeRef.current
      const valueToIndex = valueToIndexRef.current

      const size = valueToSize.get(value as number)
      const index = valueToIndex.get(value as number)

      if (__DEV__ && (size === undefined || index === undefined)) {
        const values = Array.from(valueToIndex.keys()).slice(
          0,
          childrenArray.length
        )

        console.error(
          [
            'The `value` provided to the Tabs component is invalid.',
            `None of the Tabs' children match with "${value}".`,
            `You can provide one of the following values: ${values.join(', ')}.`
          ].join('\n')
        )
      }

      if (size !== undefined && index !== undefined) {
        const tabCount = childrenArray.length
        const scrollableAreaWidth = getScrollableAreaWidth()
        const scrollableAreaContentWidth = getScrollableAreaContentWidth()

        let newIndicatorPosition: number

        if (fullWidth) {
          newIndicatorPosition = (scrollableAreaWidth / tabCount) * index
        } else if (
          centered &&
          scrollableAreaContentWidth < scrollableAreaWidth
        ) {
          newIndicatorPosition =
            (scrollableAreaWidth - scrollableAreaContentWidth) / 2 +
            size * index
        } else {
          const calculatedSpace = index * tabSpace

          newIndicatorPosition =
            scrollableAreaContentWidth -
            getScrollableAreaNextContentWidth(index) +
            calculatedSpace
        }

        if (indicatorVisibility) {
          if (animated) {
            const animationOptions = getIndicatorAnimationOptions(
              indicatorAnimationProp
            )

            const animationMethod = Animated[animationOptions.type]

            Animated.parallel([
              animationMethod(indicatorWidth, {
                ...animationOptions.config,
                toValue: size,
                useNativeDriver: false
              }),
              animationMethod(indicatorPosition, {
                ...animationOptions.config,
                toValue: newIndicatorPosition,
                useNativeDriver: false
              })
            ]).start()
          } else {
            indicatorWidth.setValue(size)
            indicatorPosition.setValue(newIndicatorPosition)
          }
        }

        if (mountedRef.current) {
          scrollSelectedIntoView(animated)
        }
      }
    })

    const updateScrollButtonState = useEventCallback(() => {
      if (!scrollable || !childrenArray.length) {
        return
      }

      const scrollableAreaWidth = getScrollableAreaWidth()
      const scrollableAreaContentSize = getScrollableAreaContentWidth()
      const isEndReached =
        scrollPositionRef.current + scrollableAreaWidth <=
        scrollableAreaContentSize - 1

      let showStartScroll
      let showEndScroll

      if (I18nManager.isRTL) {
        showStartScroll = isEndReached
        showEndScroll = scrollPositionRef.current > 1
      } else {
        showStartScroll = scrollPositionRef.current > 1
        showEndScroll = isEndReached
      }

      if (
        showStartScroll !== displayScroll.start ||
        showEndScroll !== displayScroll.end
      ) {
        setDisplayScroll({
          start: showStartScroll,
          end: showEndScroll
        })
      }
    })

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const {
        nativeEvent: { contentOffset }
      } = event

      onScroll?.(event)

      scrollPositionRef.current = contentOffset.x

      updateScrollButtonState()
    }

    const handleLayout = (event: LayoutChangeEvent) => {
      const {
        nativeEvent: { layout: currentLayout }
      } = event

      onLayout?.(event)

      const prevLayoutWidth = Math.fround(layoutSize)
      const currentLayoutWidth = Math.fround(currentLayout.width)

      if (prevLayoutWidth !== currentLayoutWidth) {
        animatedRef.current = false

        setLayoutSize(currentLayoutWidth)
      }
    }

    const handleStartScrollClick = () => {
      moveTabsScroll(-1 * getScrollableAreaWidth())
    }

    const handleEndScrollClick = () => {
      moveTabsScroll(getScrollableAreaWidth())
    }

    const handleScrollViewContentSizeChange = (w: number, h: number) => {
      scrollSelectedIntoView(false)
      mountedRef.current = true

      onContentSizeChange?.(w, h)
    }

    const indicator = indicatorVisibility ? (
      <Animated.View
        {...otherIndicatorProps}
        style={[
          {
            position: 'absolute',
            left: indicatorPosition,
            width: mounted ? indicatorWidth : '100%',
            height: indicatorSizeProp,
            [indicatorPositionProp]: 0,
            backgroundColor: indicatorColorProp
          },
          otherIndicatorProps.style
        ]}
      />
    ) : null

    const getConditionalElements = () => {
      const conditionalElements: any = {}
      const scrollButtonSize = getScrollButtonSize()
      const scrollButtonsStyle = [
        scrollButtonsProps.style,
        { width: scrollButtonSize, maxWidth: scrollButtonSize }
      ]

      conditionalElements.scrollButtonStart = showScrollButtons ? (
        <TabScrollButton
          {...scrollButtonsProps}
          direction="left"
          style={scrollButtonsStyle}
          onPress={handleStartScrollClick}
          disabled={!displayScroll.start}
          ButtonComponent={ScrollButtonComponent}
        />
      ) : null

      conditionalElements.scrollButtonEnd = showScrollButtons ? (
        <TabScrollButton
          {...scrollButtonsProps}
          direction="right"
          style={scrollButtonsStyle}
          onPress={handleEndScrollClick}
          disabled={!displayScroll.end}
          ButtonComponent={ScrollButtonComponent}
        />
      ) : null

      return conditionalElements
    }

    React.useEffect(() => {
      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        valueToSizeRef.current.clear()

        // eslint-disable-next-line react-hooks/exhaustive-deps
        valueToIndexRef.current.clear()
      }
    }, [])

    React.useEffect(() => {
      setMounted(true)
    }, [])

    React.useEffect(() => {
      updateScrollButtonState()
    }, [
      insets,
      variant,
      tabSpace,
      layoutSize,
      showScrollButtons,
      childrenArray.length,
      updateScrollButtonState
    ])

    React.useEffect(() => {
      updateIndicatorState(animatedRef.current)

      animatedRef.current = true
    }, [
      value,
      insets,
      variant,
      tabSpace,
      layoutSize,
      showScrollButtons,
      childrenArray.length,
      updateIndicatorState
    ])

    React.useImperativeHandle(
      ref,
      () => ({
        scrollView: scrollViewRef.current,
        updateIndicator: updateIndicatorState,
        updateScrollButtons: updateScrollButtonState
      }),
      [updateIndicatorState, updateScrollButtonState]
    )

    let childIndex = 0

    const children = childrenArray.map((child, index) => {
      const childProps = child.props
      const childValue =
        childProps.value === undefined ? childIndex : childProps.value

      const tabSize = calculateTabSize(childProps)

      valueToSizeRef.current.set(childValue, tabSize)
      valueToIndexRef.current.set(childValue, childIndex)

      const selected = childValue === value

      childIndex += 1

      return React.cloneElement<TabProps>(child, {
        ...tabProps,
        ...childProps,
        width: tabSize,
        onChange,
        selected,
        style: [
          tabProps.style,
          childProps.style,
          index !== 0 && !centered && { marginLeft: tabSpace }
        ],
        value: childValue,
        LabelComponent: TabLabelComponent,
        ButtonComponent: TabComponent,
        indicator: indicatorVisibility
          ? selected && !mounted && indicator
          : selected && (childProps.indicator || tabProps.indicator)
      })
    })

    const conditionalElements = getConditionalElements()

    return childrenArray.length > 0 ? (
      <View
        {...other}
        onLayout={handleLayout}
        style={[styles.container, style]}
      >
        {conditionalElements.scrollButtonStart}
        <View
          {...scrollViewContainerProps}
          style={[styles.scrollViewContainer, scrollViewContainerProps.style]}
        >
          <ScrollView
            accessibilityRole="tablist"
            automaticallyAdjustContentInsets={false}
            automaticallyAdjustsScrollIndicatorInsets={false}
            {...otherScrollViewProps}
            ref={scrollViewRef}
            onScroll={handleScroll}
            onContentSizeChange={handleScrollViewContentSizeChange}
            contentContainerStyle={[
              contentContainerStyle,
              centered && styles.centered
            ]}
            horizontal={true}
            scrollsToTop={false}
            scrollEnabled={scrollable}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {children}
            {mounted && indicator}
          </ScrollView>
        </View>
        {conditionalElements.scrollButtonEnd}
      </View>
    ) : null
  }
)

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexGrow: 1,
    minHeight: 48,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-between'
  },
  centered: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  scrollViewContainer: {
    flex: 1,
    overflow: 'hidden'
  }
})

export default Tabs
