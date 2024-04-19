import * as React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { IS_ANDROID } from '../constants'
import type { Route, TabViewState, SceneRendererProps } from '../types'

export interface SceneViewProps<T extends Route> extends SceneRendererProps {
  state: TabViewState<T>
  lazy: boolean
  index: number
  children: (props: { loading: boolean }) => React.ReactNode
  shouldSceneRender: boolean
  lazyPreloadWaitTime: number
  lazyPreloadDistance: number
  style?: StyleProp<ViewStyle>
}

const SceneView = <T extends Route>(props: SceneViewProps<T>) => {
  const {
    children,
    state,
    lazy,
    layout,
    index,
    shouldSceneRender,
    lazyPreloadDistance,
    lazyPreloadWaitTime,
    style
  } = props

  const timersRef = React.useRef<NodeJS.Timeout[]>([])

  const [isLoading, setIsLoading] = React.useState(
    Math.abs(state.index - index) > lazyPreloadDistance
  )

  if (
    lazy &&
    isLoading &&
    Math.abs(state.index - index) <= lazyPreloadDistance
  ) {
    // Always render the route when it becomes focused
    if (lazyPreloadWaitTime > 0) {
      timersRef.current.push(
        setTimeout(() => setIsLoading(false), lazyPreloadWaitTime)
      )
    } else {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (!lazy && isLoading) {
      // If lazy mode is not enabled, render the scene with a delay if not loaded already
      // This improves the initial startup time as the scene is no longer blocking
      timersRef.current.push(
        setTimeout(() => setIsLoading(false), lazyPreloadWaitTime)
      )
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timersRef.current.forEach((timer) => clearTimeout(timer))
    }
  }, [lazy, isLoading, lazyPreloadWaitTime])

  const focused = state.index === index

  return (
    <View
      style={[
        styles.route,
        // If we don't have the layout yet, make the focused screen fill the container
        // This avoids delay before we are able to render pages side by side
        layout.width
          ? { width: layout.width }
          : focused
          ? StyleSheet.absoluteFill
          : null,
        style
      ]}
      {...(IS_ANDROID && {
        // Note that you can only use View components as children of PagerView.
        // For Android if View has own children, set prop collapsable to false https://reactnative.dev/docs/view#collapsable-android,
        // otherwise react-native might remove those children views and and its children will be rendered as separate pages.
        collapsable: false
      })}
      importantForAccessibility={focused ? 'auto' : 'no-hide-descendants'}
      accessibilityElementsHidden={!focused}
    >
      {
        // Only render the route only if it's either focused or layout is available
        // When layout is not available, we must not render unfocused routes
        // so that the focused route can fill the screen
        isLoading
          ? children({ loading: isLoading })
          : shouldSceneRender
          ? children({ loading: isLoading })
          : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  route: {
    flex: 1,
    overflow: 'hidden'
  }
})

export default SceneView
