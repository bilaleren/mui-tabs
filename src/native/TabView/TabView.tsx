import * as React from 'react'
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent
} from 'react-native'
import TabBar from './TabBar'
import PagerView from './PagerView'
import SceneView from './SceneView'
import { INITIAL_LAYOUT } from '../constants'
import type {
  Route,
  Layout,
  PagerProps,
  RenderScene,
  RenderTabBar,
  TabViewState,
  SceneRendererProps
} from '../types'

export type TabViewProps<T extends Route> = PagerProps & {
  state: TabViewState<T>
  scrollEnabled?: boolean
  onIndexChange: (index: number) => void
  renderScene: RenderScene<T>
  initialLayout?: Partial<Layout>
  renderTabBar?: RenderTabBar<T>
  tabBarPosition?: 'top' | 'bottom'
  lazy?: ((props: { route: T }) => boolean) | boolean
  lazyPreloadDistance?: number
  lazyPreloadWaitTime?: number
  renderLazyPlaceholder?: (props: { route: T }) => React.ReactNode
  style?: StyleProp<ViewStyle>
  pagerStyle?: StyleProp<ViewStyle>
  sceneContainerStyle?: StyleProp<ViewStyle>
}

const defaultTabBar: RenderTabBar = (props) => <TabBar {...props} />

const defaultLazyPlaceholder = () => null

const TabView = <T extends Route>(props: TabViewProps<T>) => {
  const {
    state,
    style,
    pagerStyle,
    lazy = false,
    scrollEnabled = true,
    animationEnabled = true,
    setPageAnimationEnabled = animationEnabled,
    initialLayout = INITIAL_LAYOUT,
    onIndexChange,
    renderScene,
    renderTabBar = defaultTabBar,
    tabBarPosition = 'top',
    overScrollMode,
    lazyPreloadDistance = 0,
    lazyPreloadWaitTime = 0,
    renderLazyPlaceholder = defaultLazyPlaceholder,
    sceneContainerStyle,
    keyboardDismissMode = 'auto',
    ...other
  } = props

  const [layout, setLayout] = React.useState<Layout>({
    width: 0,
    height: 0,
    ...initialLayout
  })

  const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout

    setLayout((prevLayout) => {
      if (prevLayout.width === width && prevLayout.height === height) {
        return prevLayout
      }

      return { height, width }
    })
  }, [])

  return (
    <View style={[styles.pager, style]} onLayout={handleLayout}>
      <PagerView
        {...other}
        state={state}
        style={pagerStyle}
        scrollEnabled={scrollEnabled}
        onIndexChange={onIndexChange}
        overScrollMode={overScrollMode}
        animationEnabled={animationEnabled}
        setPageAnimationEnabled={setPageAnimationEnabled}
        keyboardDismissMode={keyboardDismissMode}
      >
        {({ render, jumpTo, position }) => {
          const sceneRendererProps: SceneRendererProps = {
            jumpTo,
            layout,
            position
          }

          const tabBar = renderTabBar({
            ...sceneRendererProps,
            state,
            scrollEnabled,
            overScrollMode,
            animationEnabled
          })

          return (
            <React.Fragment>
              {tabBarPosition === 'top' && tabBar}

              {render(
                state.routes.map((route, index) => (
                  <SceneView
                    {...sceneRendererProps}
                    key={index}
                    lazy={typeof lazy === 'function' ? lazy({ route }) : lazy}
                    index={index}
                    state={state}
                    layout={layout}
                    style={sceneContainerStyle}
                    lazyPreloadDistance={lazyPreloadDistance}
                    lazyPreloadWaitTime={lazyPreloadWaitTime}
                  >
                    {({ loading }) =>
                      loading
                        ? renderLazyPlaceholder({ route })
                        : renderScene({
                            ...sceneRendererProps,
                            index,
                            route,
                            focused: index === state.index
                          })
                    }
                  </SceneView>
                ))
              )}

              {tabBarPosition === 'bottom' && tabBar}
            </React.Fragment>
          )
        }}
      </PagerView>
    </View>
  )
}

const styles = StyleSheet.create({
  pager: {
    flex: 1,
    overflow: 'hidden'
  }
})

export default TabView
