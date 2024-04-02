import * as React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import type {
  Route,
  TabViewState,
  EventEmitterProps,
  SceneRendererProps
} from '../types'

export interface SceneViewProps<T extends Route>
  extends EventEmitterProps,
    SceneRendererProps {
  state: TabViewState<T>
  lazy: boolean
  index: number
  children: (props: { loading: boolean }) => React.ReactNode
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
    lazyPreloadDistance,
    addEnterListener,
    style
  } = props

  const [isLoading, setIsLoading] = React.useState(
    Math.abs(state.index - index) > lazyPreloadDistance
  )

  if (isLoading && Math.abs(state.index - index) <= lazyPreloadDistance) {
    // Always render the route when it becomes focused
    setIsLoading(false)
  }

  React.useEffect(() => {
    const handleEnter = (value: number) => {
      // If we're entering the current route, we need to load it
      if (value === index) {
        setIsLoading((prevState) => {
          if (prevState) {
            return false
          }
          return prevState
        })
      }
    }

    let unsubscribe: (() => void) | undefined
    let timer: NodeJS.Timeout | undefined

    if (lazy && isLoading) {
      // If lazy mode is enabled, listen to when we enter screens
      unsubscribe = addEnterListener(handleEnter)
    } else if (isLoading) {
      // If lazy mode is not enabled, render the scene with a delay if not loaded already
      // This improves the initial startup time as the scene is no longer blocking
      timer = setTimeout(() => setIsLoading(false), 0)
    }

    return () => {
      unsubscribe?.()
      clearTimeout(timer)
    }
  }, [index, isLoading, lazy, addEnterListener])

  const focused = state.index === index

  return (
    <View
      accessibilityElementsHidden={!focused}
      importantForAccessibility={focused ? 'auto' : 'no-hide-descendants'}
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
    >
      {
        // Only render the route only if it's either focused or layout is available
        // When layout is not available, we must not render unfocused routes
        // so that the focused route can fill the screen
        focused || layout.width ? children({ loading: isLoading }) : null
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
