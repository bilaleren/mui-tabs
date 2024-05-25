import * as React from 'react'
import {
  Animated,
  StyleSheet,
  ScrollViewProps,
  useWindowDimensions
} from 'react-native'
import CollapsibleTabViewContext, {
  CollapsibleTabViewContextType
} from './Context'
import { IS_IOS } from '../constants'
import { scrollTo, calculateAllPaddingVertical } from './utils'
import type {
  ScrollableRef,
  ScrollListener,
  ScrollableComponentProps
} from './types'

export function useScrollSync(ref: ScrollableRef) {
  const {
    routeKey,
    headerHeight,
    tabBarHeight,
    scrollOffsetY,
    scrollPositions
  } = useCollapsibleTabViewContext()

  React.useEffect(() => {
    const realHeaderHeight = headerHeight - tabBarHeight
    const scrollValues = Object.values(scrollPositions.current)
    const hasCollapsed = scrollValues.some((value) => value >= realHeaderHeight)
    const currentScrollPosition = scrollPositions.current[routeKey]
    const scrollPosition =
      currentScrollPosition !== undefined
        ? currentScrollPosition
        : !IS_IOS && hasCollapsed
        ? realHeaderHeight
        : IS_IOS
        ? -headerHeight
        : 0

    if (ref.current) {
      scrollTo(ref, scrollPosition, false)
      scrollOffsetY.setValue(scrollPosition)
    }
  }, [
    ref,
    routeKey,
    scrollOffsetY,
    headerHeight,
    tabBarHeight,
    scrollPositions
  ])
}

export function useScrollHandler(
  onScroll: ScrollListener | undefined
): ScrollListener {
  const { routeKey, scrollOffsetY, scrollPositions } =
    useCollapsibleTabViewContext()

  const scrollListener: ScrollListener = React.useCallback(
    (event) => {
      const { contentOffset } = event.nativeEvent

      scrollPositions.current[routeKey] = contentOffset.y

      onScroll?.(event)
    },
    [routeKey, onScroll, scrollPositions]
  )

  return Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: { y: scrollOffsetY }
        }
      }
    ],
    {
      listener: scrollListener,
      useNativeDriver: true
    }
  )
}

export function useScrollableComponentProps(
  props: ScrollViewProps,
  isScrollView?: boolean
): ScrollableComponentProps {
  const {
    contentInset,
    contentOffset,
    scrollEnabled = true,
    refreshControl: refreshControlProp,
    contentContainerStyle,
    scrollIndicatorInsets
  } = props
  const { height: windowHeight } = useWindowDimensions()
  const { headerHeight, isHeaderLayoutMeasured } =
    useCollapsibleTabViewContext()

  const refreshControl = React.useMemo(
    () =>
      refreshControlProp &&
      React.cloneElement(refreshControlProp, {
        progressViewOffset: headerHeight,
        ...refreshControlProp.props
      }),
    [headerHeight, refreshControlProp]
  )

  const flattenedStyle = React.useMemo(
    () => StyleSheet.flatten(contentContainerStyle),
    [contentContainerStyle]
  )

  return React.useMemo(() => {
    const paddingTop = calculateAllPaddingVertical(
      flattenedStyle,
      !IS_IOS ? headerHeight : 0
    )
    return {
      scrollEnabled: scrollEnabled && isHeaderLayoutMeasured,
      refreshControl,
      ...(IS_IOS && {
        contentInset: {
          top: headerHeight,
          ...contentInset
        },
        contentOffset: {
          x: 0,
          y: -headerHeight,
          ...contentOffset
        },
        scrollIndicatorInsets: {
          top: headerHeight,
          ...scrollIndicatorInsets
        }
      }),
      ...(!isScrollView && {
        progressViewOffset: headerHeight
      }),
      contentContainerStyle: {
        ...flattenedStyle,
        paddingTop,
        minHeight: windowHeight + headerHeight
      },
      automaticallyAdjustContentInsets: false,
      automaticallyAdjustsScrollIndicatorInsets: false
    }
  }, [
    isScrollView,
    windowHeight,
    refreshControl,
    contentInset,
    contentOffset,
    headerHeight,
    flattenedStyle,
    scrollEnabled,
    isHeaderLayoutMeasured,
    scrollIndicatorInsets
  ])
}

export function useCollapsibleTabViewContext(): CollapsibleTabViewContextType {
  const context = React.useContext(CollapsibleTabViewContext)

  if (!context) {
    throw new Error(
      'useCollapsibleTabViewContext must be inside a CollapsibleTabViewProvider'
    )
  }

  return context
}
