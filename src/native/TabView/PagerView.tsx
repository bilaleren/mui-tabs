import * as React from 'react'
import { Keyboard, StyleSheet } from 'react-native'
import Animated, {
  runOnJS,
  useSharedValue,
  SharedValue
} from 'react-native-reanimated'
import RNPagerView, {
  PagerViewOnPageSelectedEvent,
  PageScrollStateChangedNativeEvent
} from 'react-native-pager-view'
import usePageScrollHandler from '@utils/usePageScrollHandler'
import type { Route, PagerProps, TabViewState } from '../types'

const AnimatedPagerView = Animated.createAnimatedComponent(RNPagerView)

export interface PagerViewProps<T extends Route> extends PagerProps {
  state: TabViewState<T>
  onIndexChange: (index: number) => void
  children: (props: {
    // Animated value which represents the state of current index
    // It can include fractional digits as it represents the intermediate value
    position: SharedValue<number>
    // Function to actually render the content of the pager
    // The parent component takes care of rendering
    render: (children: React.ReactNode) => React.ReactNode
    // Callback to call when switching the tab
    // The tab switch animation is performed even if the index in state is unchanged
    jumpTo: (key: string, animated?: boolean) => void
  }) => React.ReactElement
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

  const position = useSharedValue(index)
  const offset = useSharedValue(0)

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
        position.value = index
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
        position.value = index
      }
    }
  }, [index, position, keyboardDismissMode, animationEnabled])

  const handlePageScroll = usePageScrollHandler({
    onPageScroll: (event) => {
      'worklet'
      offset.value = event.offset
      position.value = event.offset + event.position
    }
  })

  const handlePageSelected = React.useCallback(
    (event: PagerViewOnPageSelectedEvent) => {
      'worklet'
      const index = event.nativeEvent.position
      indexRef.current = index
      runOnJS(onIndexChange)(index)
    },
    [onIndexChange]
  )

  const handlePageScrollStateChanged = React.useCallback(
    (event: PageScrollStateChangedNativeEvent) => {
      const { pageScrollState } = event.nativeEvent

      switch (pageScrollState) {
        case 'idle':
          onSwipeEnd?.()
          return
        case 'dragging':
          onSwipeStart?.()
      }
    },
    [onSwipeEnd, onSwipeStart]
  )

  return children({
    position,
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
