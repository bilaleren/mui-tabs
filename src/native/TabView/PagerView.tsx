import * as React from 'react'
import { Keyboard, StyleSheet } from 'react-native'
import Animated, { runOnJS, SharedValue } from 'react-native-reanimated'
import RNPagerView, {
  PagerViewOnPageSelectedEvent,
  PageScrollStateChangedNativeEvent
} from 'react-native-pager-view'
import usePageScrollHandler from '@utils/usePageScrollHandler'
import type { Route, PagerProps, TabViewState } from '../types'
import useAnimatableSharedValue from '@utils/useAnimatableSharedValue'

const AnimatedPagerView = Animated.createAnimatedComponent(RNPagerView)

export type PagerViewProps<T extends Route> = PagerProps & {
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
    jumpTo: (key: T['key'], animated?: boolean) => void
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
    scrollEnabled,
    animationEnabled = true,
    animatedPosition,
    setPageAnimationEnabled = animationEnabled,
    keyboardDismissMode = 'auto',
    ...other
  } = props
  const { index } = state

  const [initialPage] = React.useState(index)
  const position = useAnimatableSharedValue(
    animatedPosition === undefined ? (0 as number) : animatedPosition
  )
  const pagerRef = React.useRef<RNPagerView>(null)
  const indexRef = React.useRef<number>(index)
  const stateRef = React.useRef<TabViewState<T>>(state)

  React.useEffect(() => {
    stateRef.current = state
  })

  const setPage = React.useCallback(
    (page: number, animated = setPageAnimationEnabled) => {
      if (animated) {
        pagerRef.current?.setPage(page)
      } else {
        pagerRef.current?.setPageWithoutAnimation(page)
        position.value = page
      }
    },
    [position, setPageAnimationEnabled]
  )

  const jumpTo = React.useCallback(
    (key: T['key'], animated?: boolean) => {
      const routes = stateRef.current.routes
      const nextIndex = routes.findIndex((route) => key === route.key)

      if (nextIndex === -1) {
        if (__DEV__) {
          const keys = routes.map((route) => route.key)
          const message = [
            `Route matching key [${key}] not found.`,
            `You can provide one of the following keys: ${keys.join(', ')}.`
          ].join('\n')

          console.error('[mui-tabs]', message)
        }

        return
      }

      setPage(nextIndex, animated)
    },
    [setPage]
  )

  const pageScrollHandler = usePageScrollHandler({
    onPageScroll: (event) => {
      'worklet'
      position.value = event.position + event.offset
    }
  })

  const handlePageSelected = React.useCallback(
    (event: PagerViewOnPageSelectedEvent) => {
      const { position: nextIndex } = event.nativeEvent

      if (indexRef.current !== nextIndex) {
        indexRef.current = nextIndex
        runOnJS(onIndexChange)(nextIndex)
      }
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

  React.useEffect(() => {
    if (keyboardDismissMode === 'auto') {
      Keyboard.dismiss()
    }

    if (indexRef.current !== index) {
      setPage(index)
    }
  }, [index, setPage, keyboardDismissMode])

  return children({
    position,
    jumpTo,
    render: (children) => (
      <AnimatedPagerView
        {...other}
        ref={pagerRef}
        style={[styles.container, style]}
        initialPage={initialPage}
        keyboardDismissMode={
          keyboardDismissMode === 'auto' ? 'on-drag' : keyboardDismissMode
        }
        scrollEnabled={scrollEnabled}
        onPageScroll={scrollEnabled ? pageScrollHandler : undefined}
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
