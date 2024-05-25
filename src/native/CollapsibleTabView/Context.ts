import * as React from 'react'
import type { Animated } from 'react-native'

export interface CollapsibleTabViewContextType {
  routeKey: string
  headerHeight: number
  tabBarHeight: number
  scrollOffsetY: Animated.Value
  setHeaderHeight: React.Dispatch<number>
  setTabBarHeight: React.Dispatch<number>
  scrollPositions: React.MutableRefObject<Record<string, number>>
  isHeaderLayoutMeasured: boolean
}

const CollapsibleTabViewContext = React.createContext<
  CollapsibleTabViewContextType | undefined
>(undefined)

export default CollapsibleTabViewContext
