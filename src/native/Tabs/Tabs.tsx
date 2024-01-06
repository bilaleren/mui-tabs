import * as React from 'react'
import {
  View,
  Easing,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  ColorValue,
  ViewProps,
  ScrollViewProps,
  NativeScrollEvent,
  LayoutChangeEvent,
  NativeSyntheticEvent
} from 'react-native'
import type { TabProps } from '../Tab'
import useTabsController from './useTabsController'
import useLatestCallback from 'use-latest-callback'
import type { TabButtonProps } from '../TabButton'
import isReactFragment from '@utils/isReactFragment'
import TabScrollButton, { TabScrollButtonProps } from '../TabScrollButton'
import type {
  TabValue,
  TabsVariant,
  ChangeHandler,
  IndicatorAnimationCallback
} from '../types'

type BaseTabsProps = Omit<ViewProps, 'children'>

export interface TabsRefAttributes {
  updateIndicator: (animated?: boolean) => void
  updateScrollButtons: () => void
}

export interface IndicatorProps extends ViewProps {
  /**
   * The indicator determines its height.
   * @default 2
   */
  size?: number | 'auto' | `${number}%`

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
   * The indicator determines its enabled.
   * @default true
   */
  enabled?: boolean

  /**
   * Create a custom indicator animation.
   */
  animation?: IndicatorAnimationCallback
}

export interface TabsProps<Value extends TabValue = any> extends BaseTabsProps {
  children: React.ReactElement<TabProps>[]

  /**
   * The value of the currently selected `Tab`.
   */
  value?: Value

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
  variant?: TabsVariant

  /**
   * Callback fired when the value changes.
   */
  onChange?: ChangeHandler<Value>

  /**
   * Determine behavior of scroll buttons when tabs are set to scroll.
   * @default false
   */
  scrollButtons?: boolean

  /**
   * The initial window size. It is used to determine the sizes and positions of the tabs and the indicator.
   * @default Dimensions.get('screen').width
   */
  initialLayoutWidth?: number

  /**
   * Override the Tab props.
   */
  tabProps?: Partial<
    Omit<
      TabProps,
      'selected' | 'value' | 'ButtonComponent' | 'label' | 'onChange'
    >
  >

  /**
   * Override the Indicator props.
   */
  indicatorProps?: IndicatorProps

  /**
   * Override the ScrollView props.
   */
  scrollViewProps?: Partial<
    Omit<
      ScrollViewProps,
      | 'horizontal'
      | 'scrollsToTop'
      | 'showsVerticalScrollIndicator'
      | 'showsHorizontalScrollIndicator'
    >
  >

  /**
   * Override the TabScrollButton props.
   */
  scrollButtonProps?: Partial<
    Omit<TabScrollButtonProps, 'type' | 'onPress' | 'ButtonComponent'>
  >

  /**
   * The component used to render the tabs.
   */
  TabComponent?: React.ComponentType<TabButtonProps>

  /**
   * The component used to render the scroll buttons.
   */
  ScrollButtonComponent?: React.ComponentType<TabButtonProps>

  /**
   * Override the ScrollViewContainer props.
   */
  scrollViewContainerProps?: Partial<ViewProps>
}

interface TabsComponent extends React.ForwardRefExoticComponent<TabsProps> {
  <Value extends TabValue = any>(
    props: TabsProps<Value> & React.RefAttributes<TabsRefAttributes>
  ): ReturnType<React.FC<TabsProps<Value>>>
}

const defaultIndicatorAnimation: IndicatorAnimationCallback = (
  value,
  animatedValue
) => {
  return Animated.timing(animatedValue, {
    toValue: value,
    delay: 0,
    duration: 300,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    useNativeDriver: false
  })
}

const Tabs: TabsComponent = React.forwardRef<TabsRefAttributes, TabsProps>(
  (props, ref) => {
    const {
      style,
      value,
      variant = 'standard',
      children: childrenProp,
      onChange,
      scrollButtons = false,
      tabProps,
      indicatorProps = {},
      scrollViewProps = {},
      scrollButtonProps,
      scrollViewContainerProps = {},
      TabComponent,
      ScrollButtonComponent,
      initialLayoutWidth = Dimensions.get('screen').width,
      ...otherProps
    } = props
    const mountedRef = React.useRef<boolean>(false)
    const [layoutWidth, setLayoutWidth] = React.useState(initialLayoutWidth)

    const {
      size: indicatorSize = 2,
      style: indicatorStyle,
      color: indicatorColor = '#1976D2',
      enabled: indicatorEnabled = true,
      position: indicatorPosition = 'bottom',
      animation: indicatorAnimation = defaultIndicatorAnimation,
      ...otherIndicatorProps
    } = indicatorProps

    const fullWidth = variant === 'fullWidth'
    const scrollable = variant === 'scrollable'
    const scrollButtonsEnabled = scrollable && scrollButtons
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

    const {
      tabsCount,
      scrollToSelectedTab,
      updateIndicatorState,
      updateMemoizedTabValues,
      updateScrollButtonsState,
      moveTabsScrollToStart,
      moveTabsScrollToEnd,
      scrollViewRef,
      scrollOffsetRef,
      valueToSizeRef,
      valueToIndexRef,
      startScrollButtonRef,
      endScrollButtonRef,
      indicatorWidthValue,
      indicatorPositionValue
    } = useTabsController({
      value,
      tabs: childrenArray,
      scrollable,
      layoutWidth,
      indicatorEnabled,
      indicatorAnimation
    })

    const handleScroll = useLatestCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const {
          nativeEvent: { contentOffset }
        } = event

        scrollOffsetRef.current = contentOffset.x

        updateScrollButtonsState()

        scrollViewProps.onScroll?.(event)
      }
    )

    const handleLayout = useLatestCallback((event: LayoutChangeEvent) => {
      const {
        nativeEvent: { layout }
      } = event

      if (layout.width !== layoutWidth) {
        setLayoutWidth(layout.width)
      }

      scrollViewContainerProps.onLayout?.(event)
    })

    const handleContentSizeChange = useLatestCallback(
      (width: number, height: number) => {
        updateMemoizedTabValues()
        scrollToSelectedTab(false)

        if (scrollButtonsEnabled) {
          updateScrollButtonsState(width)
        }

        scrollViewProps.onContentSizeChange?.(width, height)
      }
    )

    React.useEffect(() => {
      updateIndicatorState(mountedRef.current)
      scrollToSelectedTab(mountedRef.current)
    }, [value, indicatorEnabled, scrollToSelectedTab, updateIndicatorState])

    React.useEffect(() => {
      if (!mountedRef.current && scrollButtonsEnabled) {
        updateScrollButtonsState()
      }
    }, [scrollButtonsEnabled, updateScrollButtonsState])

    React.useEffect(() => {
      mountedRef.current = true
    }, [])

    React.useImperativeHandle(
      ref,
      () => ({
        updateIndicator: updateIndicatorState,
        updateScrollButtons: updateScrollButtonsState
      }),
      [updateIndicatorState, updateScrollButtonsState]
    )

    const children = childrenArray.map((child, index) => {
      const props: TabProps = {
        ...tabProps,
        ...child.props
      }
      const childValue = props.value === undefined ? index : props.value
      const selected = value === childValue
      const tabWidth = layoutWidth / tabsCount

      valueToIndexRef.current.set(childValue, index)

      if (fullWidth) {
        valueToSizeRef.current.set(childValue, tabWidth)
      }

      return React.cloneElement(child, {
        ...props,
        value: childValue,
        selected,
        onChange,
        ...(fullWidth && {
          style: [props.style, { width: tabWidth }]
        }),
        ButtonComponent: TabComponent,
        onLayout(event) {
          const {
            nativeEvent: { layout }
          } = event

          if (!fullWidth) {
            valueToSizeRef.current.set(childValue, layout.width)
          }

          if (selected) {
            updateIndicatorState(false)
            scrollToSelectedTab(false)
          }

          props.onLayout?.(event)
        }
      } as TabProps)
    })

    return (
      <View {...otherProps} style={[styles.container, style]}>
        {scrollButtonsEnabled && (
          <TabScrollButton
            {...scrollButtonProps}
            ref={startScrollButtonRef}
            type="start"
            onPress={moveTabsScrollToStart}
            ButtonComponent={ScrollButtonComponent}
          />
        )}

        <View
          {...scrollViewContainerProps}
          style={[styles.scrollViewContainer, scrollViewContainerProps.style]}
          onLayout={handleLayout}
        >
          <ScrollView
            accessibilityRole="tablist"
            scrollEventThrottle={16}
            automaticallyAdjustContentInsets={false}
            automaticallyAdjustsScrollIndicatorInsets={false}
            {...scrollViewProps}
            ref={scrollViewRef}
            onScroll={handleScroll}
            horizontal={true}
            scrollsToTop={false}
            scrollEnabled={scrollable}
            onContentSizeChange={handleContentSizeChange}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {children}
            {indicatorEnabled && (
              <Animated.View
                accessibilityRole="none"
                importantForAccessibility="no"
                {...otherIndicatorProps}
                style={[
                  {
                    position: 'absolute',
                    [indicatorPosition]: 0,
                    left: indicatorPositionValue,
                    width: indicatorWidthValue,
                    height: indicatorSize,
                    backgroundColor: indicatorColor
                  },
                  indicatorStyle
                ]}
              />
            )}
          </ScrollView>
        </View>

        {scrollButtonsEnabled && (
          <TabScrollButton
            {...scrollButtonProps}
            ref={endScrollButtonRef}
            type="end"
            onPress={moveTabsScrollToEnd}
            ButtonComponent={ScrollButtonComponent}
          />
        )}
      </View>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    maxHeight: 80,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  scrollViewContainer: {
    flex: 1,
    overflow: 'hidden'
  }
})

export default Tabs
