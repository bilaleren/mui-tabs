import * as React from 'react'
import {
  View,
  Animated,
  StyleSheet,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent
} from 'react-native'
import TabViewComponent, { TabBar, TabViewProps } from '../TabView'
import { useCollapsibleTabViewContext } from './hooks'
import type { RenderHeader } from './types'
import type { Route, RenderTabBar } from '../types'

const TabView = <T extends Route>(
  props: TabViewProps<T> & {
    renderHeader: RenderHeader
    headerStyle?: ViewStyle
  }
) => {
  const {
    renderHeader,
    headerStyle,
    renderTabBar: renderTabBarProp,
    ...other
  } = props

  const {
    headerHeight,
    tabBarHeight,
    scrollOffsetY,
    setHeaderHeight,
    setTabBarHeight,
    isHeaderLayoutMeasured
  } = useCollapsibleTabViewContext()

  const handleHeaderLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { layout } = event.nativeEvent
      setHeaderHeight(layout.height)
    },
    [setHeaderHeight]
  )

  const handleTabBarLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { layout } = event.nativeEvent
      setTabBarHeight(layout.height)
    },
    [setTabBarHeight]
  )

  const tabBarContainerStyle = React.useMemo<StyleProp<ViewStyle>>(
    () => [
      headerStyle,
      isHeaderLayoutMeasured && styles.tabBarContainer,
      isHeaderLayoutMeasured && {
        transform: [
          {
            translateY: scrollOffsetY.interpolate({
              inputRange: [0, headerHeight - tabBarHeight],
              outputRange: [0, -(headerHeight - tabBarHeight)],
              extrapolate: 'clamp'
            })
          }
        ]
      }
    ],
    [
      headerHeight,
      headerStyle,
      tabBarHeight,
      scrollOffsetY,
      isHeaderLayoutMeasured
    ]
  )

  const renderTabBar: RenderTabBar<T> = React.useCallback(
    (props) => (
      <Animated.View
        style={tabBarContainerStyle}
        onLayout={handleHeaderLayout}
        pointerEvents="box-none"
      >
        {renderHeader({
          headerHeight,
          tabBarHeight,
          scrollOffsetY
        })}
        <View onLayout={handleTabBarLayout}>
          {renderTabBarProp ? renderTabBarProp(props) : <TabBar {...props} />}
        </View>
      </Animated.View>
    ),
    [
      renderHeader,
      headerHeight,
      tabBarHeight,
      scrollOffsetY,
      renderTabBarProp,
      handleHeaderLayout,
      handleTabBarLayout,
      tabBarContainerStyle
    ]
  )

  return <TabViewComponent<T> {...other} renderTabBar={renderTabBar} />
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999
  }
})

export default TabView
