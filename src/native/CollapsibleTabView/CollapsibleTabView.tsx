import * as React from 'react'
import { ViewStyle } from 'react-native'
import TabView from './TabView'
import CollapsibleTabViewProvider from './Provider'
import { TAB_BAR_HEIGHT } from '../constants'
import type { Route } from '../types'
import type { RenderHeader } from './types'
import type { TabViewProps } from '../TabView'

export type CollapsibleTabViewProps<T extends Route> = Omit<
  TabViewProps<T>,
  'tabBarPosition'
> & {
  renderHeader: RenderHeader
  headerStyle?: ViewStyle
  defaultHeaderHeight?: number
  defaultTabBarHeight?: number
}

const CollapsibleTabView = <T extends Route>(
  props: CollapsibleTabViewProps<T>
) => {
  const {
    state,
    renderHeader,
    headerStyle,
    defaultHeaderHeight = 0,
    defaultTabBarHeight = TAB_BAR_HEIGHT,
    ...other
  } = props

  return (
    <CollapsibleTabViewProvider
      state={state}
      defaultHeaderHeight={defaultHeaderHeight}
      defaultTabBarHeight={defaultTabBarHeight}
    >
      <TabView
        {...other}
        state={state}
        renderHeader={renderHeader}
        headerStyle={headerStyle}
        tabBarPosition="top"
      />
    </CollapsibleTabViewProvider>
  )
}

export default CollapsibleTabView
