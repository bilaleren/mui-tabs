import * as React from 'react'
import { TAB_BAR_HEIGHT } from '../constants'
import CollapsibleTabViewContext from './Context'
import useAnimatedValue from '@utils/useAnimatedValue'
import type { Route, TabViewState } from '../types'

export interface CollapsibleTabViewProviderProps {
  children: React.ReactNode
  state: TabViewState<Route>
  defaultHeaderHeight?: number
  defaultTabBarHeight?: number
}

const CollapsibleTabViewProvider: React.FC<CollapsibleTabViewProviderProps> = ({
  children,
  state,
  defaultHeaderHeight = 0,
  defaultTabBarHeight = TAB_BAR_HEIGHT
}) => {
  const [headerHeight, setHeaderHeight] = React.useState(defaultHeaderHeight)
  const [tabBarHeight, setTabBarHeight] = React.useState(defaultTabBarHeight)

  const scrollOffsetY = useAnimatedValue(0)
  const currentRoute = state.routes[state.index]
  const scrollPositions = React.useRef<Record<string, number>>({})
  const headerHeightRef = React.useRef(headerHeight)
  const tabBarHeightRef = React.useRef(tabBarHeight)

  const updateHeaderHeight = React.useCallback((value: number) => {
    if (value !== headerHeightRef.current) {
      setHeaderHeight(value)
      headerHeightRef.current = value
    }
  }, [])

  const updateTabBarHeight = React.useCallback((value: number) => {
    if (value !== tabBarHeightRef.current) {
      setTabBarHeight(value)
      tabBarHeightRef.current = value
    }
  }, [])

  const isHeaderLayoutMeasured = React.useMemo(
    () => headerHeight > 0 && headerHeight - tabBarHeight >= tabBarHeight,
    [headerHeight, tabBarHeight]
  )

  return (
    <CollapsibleTabViewContext.Provider
      value={{
        routeKey: currentRoute.key,
        tabBarHeight,
        headerHeight,
        scrollOffsetY,
        setHeaderHeight: updateHeaderHeight,
        setTabBarHeight: updateTabBarHeight,
        scrollPositions,
        isHeaderLayoutMeasured
      }}
    >
      {children}
    </CollapsibleTabViewContext.Provider>
  )
}

const MemoCollapsibleTabViewProvider = React.memo(CollapsibleTabViewProvider)

if (__DEV__) {
  MemoCollapsibleTabViewProvider.displayName =
    MemoCollapsibleTabViewProvider.displayName || 'CollapsibleTabViewProvider'
}

export default MemoCollapsibleTabViewProvider
