import * as React from 'react'
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent
} from 'react-native'
import PagerView from './PagerView'
import SceneView from './SceneView'
import TabBar, { TabBarProps } from './TabBar'
import useLatestCallback from 'use-latest-callback'
import type {
  Route,
  Layout,
  PagerProps,
  RenderTabBar,
  TabViewState,
  SceneRendererProps
} from '../types'

export type TabViewProps<T extends Route> = PagerProps & {
  state: TabViewState<T>
  scrollEnabled?: boolean
  tabBarProps?: Omit<
    TabBarProps<T>,
    'state' | 'scrollEnabled' | 'overScrollMode' | keyof SceneRendererProps
  >
  onIndexChange: (index: number) => void
  renderScene: (props: SceneRendererProps & { route: T }) => React.ReactNode
  renderLazyPlaceholder?: (props: { route: T }) => React.ReactNode
  renderTabBar?: RenderTabBar
  initialLayout?: Partial<Layout>
  tabBarPosition?: 'top' | 'bottom'
  lazy?: ((props: { route: T }) => boolean) | boolean
  lazyPreloadDistance?: number
  sceneContainerStyle?: StyleProp<ViewStyle>
  pagerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
}

const defaultTabBar: RenderTabBar = (props) => <TabBar {...props} />

const defaultLazyPlaceholder = () => null

const TabView = <T extends Route>(props: TabViewProps<T>) => {
  const {
    style,
    lazy = false,
    state,
    pagerStyle,
    tabBarProps,
    scrollEnabled,
    animationEnabled = true,
    initialLayout,
    onSwipeStart,
    onSwipeEnd,
    onIndexChange,
    renderScene,
    renderTabBar = defaultTabBar,
    tabBarPosition = 'top',
    overScrollMode,
    lazyPreloadDistance = 0,
    renderLazyPlaceholder = defaultLazyPlaceholder,
    sceneContainerStyle,
    keyboardDismissMode = 'auto'
  } = props

  const [layout, setLayout] = React.useState<Layout>({
    width: 0,
    height: 0,
    ...initialLayout
  })

  const jumpToIndex = React.useCallback(
    (index: number) => {
      if (index !== state.index) {
        onIndexChange(index)
      }
    },
    [state.index, onIndexChange]
  )

  const handleLayout = useLatestCallback((event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout

    setLayout((prevLayout) => {
      if (prevLayout.width === width && prevLayout.height === height) {
        return prevLayout
      }

      return { height, width }
    })
  })

  return (
    <View style={[styles.pager, style]} onLayout={handleLayout}>
      <PagerView
        state={state}
        style={pagerStyle}
        scrollEnabled={scrollEnabled}
        onSwipeStart={onSwipeStart}
        onSwipeEnd={onSwipeEnd}
        onIndexChange={jumpToIndex}
        overScrollMode={overScrollMode}
        animationEnabled={animationEnabled}
        keyboardDismissMode={keyboardDismissMode}
      >
        {({ jumpTo, render, position, addEnterListener }) => {
          const sceneRendererProps: SceneRendererProps = {
            position,
            layout,
            jumpTo
          }

          return (
            <React.Fragment>
              {tabBarPosition === 'top' &&
                renderTabBar({
                  ...tabBarProps,
                  ...sceneRendererProps,
                  state,
                  scrollEnabled,
                  overScrollMode
                })}

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
                    addEnterListener={addEnterListener}
                    lazyPreloadDistance={lazyPreloadDistance}
                  >
                    {({ loading }) =>
                      loading
                        ? renderLazyPlaceholder({ route })
                        : renderScene({
                            ...sceneRendererProps,
                            route
                          })
                    }
                  </SceneView>
                ))
              )}

              {tabBarPosition === 'bottom' &&
                renderTabBar({
                  ...tabBarProps,
                  ...sceneRendererProps,
                  state,
                  scrollEnabled,
                  overScrollMode
                })}
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
