import * as React from 'react'
import Tabs, { TabsProps } from '../Tabs'
import type {
  Route,
  TabItem,
  Layout,
  TabViewState,
  SceneRendererProps
} from '../types'

export type TabBarProps<T extends Route> = Omit<
  TabsProps<string>,
  | 'tabs'
  | 'value'
  | 'onChange'
  | 'scrollable'
  | 'animatedPosition'
  | 'initialLayoutWidth'
> &
  Omit<SceneRendererProps, 'layout'> & {
    state: TabViewState<T>
    layout?: Partial<Layout>
    scrollEnabled?: boolean
  }

const TabBar = <T extends Route>(props: TabBarProps<T>) => {
  const { jumpTo, state, layout, position, scrollEnabled, ...other } = props

  const { index, routes } = state

  const tabs: TabItem<string>[] = React.useMemo(
    () =>
      routes.map(({ key, ...other }) => ({
        value: key,
        ...other
      })),
    [routes]
  )

  const handleChange = React.useCallback(
    (value: string) => jumpTo(value),
    [jumpTo]
  )

  return (
    <Tabs<string>
      {...other}
      tabs={tabs}
      value={tabs[index]?.value}
      onChange={handleChange}
      scrollable={scrollEnabled}
      animatedPosition={position}
      initialLayoutWidth={layout?.width}
    />
  )
}

export default TabBar
