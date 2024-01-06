import * as React from 'react'
import { Animated, ScrollView } from 'react-native'
import type { TabProps } from '../Tab'
import useLatestCallback from 'use-latest-callback'
import sumValues from '@utils/sumValues'
import useAnimatedValue from '@utils/useAnimatedValue'
import type { TabValue, IndicatorAnimationCallback } from '../types'
import type { TabScrollButtonRefAttributes } from '../TabScrollButton'

export interface UseTabsControllerProps {
  value: TabValue
  tabs: React.ReactElement<TabProps>[]
  scrollable: boolean
  layoutWidth: number
  indicatorEnabled: boolean
  indicatorAnimation: IndicatorAnimationCallback
}

export interface UseTabsController {
  tabsCount: number
  tabValues: TabValue[]
  scrollTo: (delta: number, animated?: boolean) => void
  getTabsWidth: (endIndex: number) => number
  scrollToSelectedTab: (animated?: boolean) => void
  updateIndicatorState: (animated?: boolean) => void
  updateMemoizedTabValues: () => void
  updateScrollButtonsState: (contentWidth?: number) => void
  moveTabsScrollToStart: () => void
  moveTabsScrollToEnd: () => void
  scrollViewRef: React.RefObject<ScrollView>
  scrollOffsetRef: React.MutableRefObject<number>
  valueToSizeRef: React.MutableRefObject<Map<TabValue, number>>
  valueToIndexRef: React.MutableRefObject<Map<TabValue, number>>
  startScrollButtonRef: React.RefObject<TabScrollButtonRefAttributes>
  endScrollButtonRef: React.RefObject<TabScrollButtonRefAttributes>
  indicatorWidthValue: Animated.Value
  indicatorPositionValue: Animated.Value
}

function getTabValue(props: TabProps, index: number): TabValue {
  return props.value ?? index
}

function useTabsController(props: UseTabsControllerProps): UseTabsController {
  const {
    value,
    tabs,
    scrollable,
    layoutWidth,
    indicatorEnabled,
    indicatorAnimation
  } = props

  const tabsCount = tabs.length
  const scrollViewRef = React.useRef<ScrollView>(null)
  const scrollOffsetRef = React.useRef<number>(0)
  const valueToSizeRef = React.useRef<Map<TabValue, number>>(new Map())
  const valueToIndexRef = React.useRef<Map<TabValue, number>>(new Map())
  const tabValues = React.useMemo(() => {
    return tabs.map((value, index) => getTabValue(value.props, index))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabsCount])
  const indicatorWidthValue = useAnimatedValue(0)
  const indicatorPositionValue = useAnimatedValue(0)
  const scrollButtonsStateRef = React.useRef({
    start: false,
    end: false
  })
  const startScrollButtonRef = React.useRef<TabScrollButtonRefAttributes>(null)
  const endScrollButtonRef = React.useRef<TabScrollButtonRefAttributes>(null)

  const scrollTo = useLatestCallback((delta: number, animated?: boolean) => {
    const scrollView = scrollViewRef.current

    if (!scrollView) {
      return
    }

    scrollView.scrollTo({
      x: delta,
      animated
    })
  })

  const moveTabsScroll = useLatestCallback((delta: number) => {
    const newDelta = scrollOffsetRef.current + delta
    scrollTo(newDelta, true)
  })

  const moveTabsScrollToStart = useLatestCallback(() => {
    moveTabsScroll(-1 * layoutWidth)
  })

  const moveTabsScrollToEnd = useLatestCallback(() => {
    moveTabsScroll(layoutWidth)
  })

  const getTabsWidth = useLatestCallback((endIndex: number): number => {
    const values = Array.from(valueToSizeRef.current.values())
    return sumValues(values.slice(0, endIndex))
  })

  const scrollToSelectedTab = useLatestCallback((animated?: boolean) => {
    const tabIndex = valueToIndexRef.current.get(value)
    const tabWidth = valueToSizeRef.current.get(value)

    if (scrollable && tabIndex !== undefined) {
      const tabsWidth = getTabsWidth(tabIndex + 1)
      const delta = tabsWidth - layoutWidth + (tabWidth || 0)

      scrollTo(delta, animated)
    }
  })

  const updateIndicatorState = useLatestCallback((animated?: boolean) => {
    if (!indicatorEnabled) {
      return
    }

    const valueToSize = valueToSizeRef.current
    const valueToIndex = valueToIndexRef.current

    const tabWidth = valueToSize.get(value)
    const tabIndex = valueToIndex.get(value)

    if (tabIndex === undefined) {
      if (__DEV__) {
        const values = Array.from(valueToIndex.keys())

        console.warn(
          [
            'The `value` provided to the Tabs component is invalid.',
            `None of the Tabs' children match with "${value}".`,
            `You can provide one of the following values: ${values.join(', ')}.`
          ].join('\n')
        )
      }

      return
    }

    // tab width is undefined in the first render
    if (tabWidth === undefined) {
      return
    }

    const tabsWidth = getTabsWidth(tabIndex)

    if (animated) {
      Animated.parallel([
        indicatorAnimation(tabWidth, indicatorWidthValue, 'width'),
        indicatorAnimation(tabsWidth, indicatorPositionValue, 'position')
      ]).start()
    } else {
      indicatorWidthValue.setValue(tabWidth)
      indicatorPositionValue.setValue(tabsWidth)
    }
  })

  const updateMemoizedTabValues = useLatestCallback(() => {
    const valueToSize = valueToSizeRef.current
    const valueToIndex = valueToIndexRef.current

    if (tabValues.length === valueToIndex.size) {
      return
    }

    for (const value of valueToIndex.keys()) {
      if (!tabValues.includes(value)) {
        valueToSize.delete(value)
        valueToIndex.delete(value)
      }
    }
  })

  const updateScrollButtonsState = useLatestCallback(
    (contentWidth?: number) => {
      if (!scrollable) {
        return
      }

      const startButton = startScrollButtonRef.current
      const endButton = endScrollButtonRef.current
      const scrollButtonsState = scrollButtonsStateRef.current

      if (!startButton || !endButton) {
        return
      }

      const scrollWidth = (contentWidth ?? getTabsWidth(tabsCount)) - 1
      const disableStartButton = scrollOffsetRef.current === 0
      const disableEndButton =
        scrollOffsetRef.current + layoutWidth >= scrollWidth

      if (disableStartButton !== scrollButtonsState.start) {
        scrollButtonsStateRef.current.start = disableStartButton
        startButton.setDisabled(disableStartButton)
      }

      if (disableEndButton !== scrollButtonsState.end) {
        scrollButtonsStateRef.current.end = disableEndButton
        endButton.setDisabled(disableEndButton)
      }
    }
  )

  return {
    tabsCount,
    tabValues,
    scrollTo,
    getTabsWidth,
    scrollToSelectedTab,
    updateIndicatorState,
    updateMemoizedTabValues,
    updateScrollButtonsState,
    moveTabsScrollToStart,
    moveTabsScrollToEnd,
    scrollViewRef,
    valueToSizeRef,
    valueToIndexRef,
    startScrollButtonRef,
    endScrollButtonRef,
    scrollOffsetRef,
    indicatorWidthValue,
    indicatorPositionValue
  }
}

export default useTabsController
