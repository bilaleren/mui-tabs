import * as React from 'react'
import { Animated, Keyboard, StyleSheet } from 'react-native'
import RNPagerView, {
  PagerViewOnPageSelectedEvent,
  PageScrollStateChangedNativeEvent
} from 'react-native-pager-view'
import useLatestCallback from 'use-latest-callback'
import useAnimatedValue from '@utils/useAnimatedValue'
import type {
  Route,
  Listener,
  PagerProps,
  TabViewState,
  EventEmitterProps
} from '../types'

const AnimatedPagerView = Animated.createAnimatedComponent(RNPagerView)

export interface PagerViewProps<T extends Route> extends PagerProps {
  state: TabViewState<T>
  onIndexChange: (index: number) => void
  children: (
    props: EventEmitterProps & {
      // Animated value which represents the state of current index
      // It can include fractional digits as it represents the intermediate value
      position: Animated.AnimatedInterpolation<number>
      // Function to actually render the content of the pager
      // The parent component takes care of rendering
      render: (children: React.ReactNode) => React.ReactNode
      // Callback to call when switching the tab
      // The tab switch animation is performed even if the index in state is unchanged
      jumpTo: (key: string, animated?: boolean) => void
    }
  ) => React.ReactElement
}

const PagerView = <T extends Route>(props: PagerViewProps<T>) => {
  const {
    children,
    style,
    state,
    onIndexChange,
    onSwipeEnd,
    onSwipeStart,
    scrollEnabled = true,
    animationEnabled,
    keyboardDismissMode = 'auto',
    ...other
  } = props
  const { index } = state

  const pagerRef = React.useRef<RNPagerView>(null)
  const indexRef = React.useRef<number>(index)
  const stateRef = React.useRef<TabViewState<T>>(state)
  const listenersRef = React.useRef<Listener[]>([])

  const position = useAnimatedValue(index)
  const offset = useAnimatedValue(0)
  const memoizedPosition = React.useMemo(
    () => Animated.add<number>(position, offset),
    [offset, position]
  )

  React.useEffect(() => {
    stateRef.current = state
  })

  const jumpTo = React.useCallback(
    (key: string, animated = animationEnabled) => {
      const routes = stateRef.current.routes
      const index = routes.findIndex((route) => key === route.key)

      if (index === -1) {
        if (__DEV__) {
          const keys = routes.map((route) => route.key)

          console.error(
            '[mui-tabs]',
            [
              `Route matching key [${key}] not found.`,
              `You can provide one of the following keys: ${keys.join(', ')}.`
            ].join('\n')
          )
        }

        return
      }

      if (animated) {
        pagerRef.current?.setPage(index)
      } else {
        pagerRef.current?.setPageWithoutAnimation(index)
        position.setValue(index)
      }
    },
    [position, animationEnabled]
  )

  React.useEffect(() => {
    if (keyboardDismissMode === 'auto') {
      Keyboard.dismiss()
    }

    if (indexRef.current !== index) {
      if (animationEnabled) {
        pagerRef.current?.setPage(index)
      } else {
        pagerRef.current?.setPageWithoutAnimation(index)
        position.setValue(index)
      }
    }
  }, [index, keyboardDismissMode, animationEnabled, position])

  const handlePageScroll = React.useMemo(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              offset,
              position
            }
          }
        ],
        { useNativeDriver: false }
      ),
    [offset, position]
  )

  const handlePageSelected = useLatestCallback(
    (event: PagerViewOnPageSelectedEvent) => {
      const index = event.nativeEvent.position
      indexRef.current = index
      onIndexChange(index)
    }
  )

  const handlePageScrollStateChanged = useLatestCallback(
    (event: PageScrollStateChangedNativeEvent) => {
      const { pageScrollState } = event.nativeEvent

      switch (pageScrollState) {
        case 'idle':
          onSwipeEnd?.()
          return
        case 'dragging': {
          const subscription = offset.addListener(({ value }) => {
            const next =
              index + (value > 0 ? Math.ceil(value) : Math.floor(value))

            if (next !== index) {
              listenersRef.current.forEach((listener) => listener(next))
            }

            offset.removeListener(subscription)
          })

          onSwipeStart?.()
        }
      }
    }
  )

  const addEnterListener = React.useCallback((listener: Listener) => {
    listenersRef.current.push(listener)

    return () => {
      const index = listenersRef.current.indexOf(listener)

      if (index > -1) {
        listenersRef.current.splice(index, 1)
      }
    }
  }, [])

  return children({
    position: memoizedPosition,
    addEnterListener,
    jumpTo,
    render: (children) => (
      <AnimatedPagerView
        {...other}
        ref={pagerRef}
        style={[styles.container, style]}
        initialPage={index}
        keyboardDismissMode={
          keyboardDismissMode === 'auto' ? 'on-drag' : keyboardDismissMode
        }
        scrollEnabled={scrollEnabled}
        onPageScroll={scrollEnabled ? handlePageScroll : undefined}
        onPageSelected={handlePageSelected}
        onPageScrollStateChanged={handlePageScrollStateChanged}
      >
        {children}
      </AnimatedPagerView>
    )
  })
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default PagerView
