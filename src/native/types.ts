import * as React from 'react'
import {
  Animated,
  StyleProp,
  TextStyle,
  ColorValue,
  ScrollViewProps
} from 'react-native'
import type { PagerViewProps } from 'react-native-pager-view'
import type { TabBarProps } from './TabView'
import type { TabsIndicatorProps } from './TabsIndicator'

export type TabValue = string | number

export interface RenderTabIconProps<Value extends TabValue = TabValue> {
  item: TabItem<Value>
  color: ColorValue
  selected: boolean
  disabled: boolean
}

export interface RenderTabLabelProps<Value extends TabValue = TabValue> {
  item: TabItem<Value>
  color: ColorValue
  style: StyleProp<TextStyle>
  selected: boolean
  disabled: boolean
}

export interface RenderTabBadgeProps<Value extends TabValue = TabValue> {
  item: TabItem<Value>
  color: ColorValue
  selected: boolean
  disabled: boolean
}

export type RenderTabIcon<Value extends TabValue = TabValue> = (
  props: RenderTabIconProps<Value>
) => React.ReactNode

export type RenderTabLabel<Value extends TabValue = TabValue> = (
  props: RenderTabLabelProps<Value>
) => React.ReactNode

export type RenderTabBadge<Value extends TabValue = TabValue> = (
  props: RenderTabBadgeProps<Value>
) => React.ReactNode

export interface ChangeEvent<Value extends TabValue = TabValue> {
  item: TabItem<Value>
  defaultPrevented: boolean
  preventDefault(): void
}

export interface TabPressEvent<Value extends TabValue = TabValue> {
  item: TabItem<Value>
  defaultPrevented: boolean
  preventDefault(): void
}

export interface TabLongPressEvent<Value extends TabValue = TabValue> {
  item: TabItem<Value>
}

export type OnChange<Value extends TabValue = TabValue> = (
  value: Value,
  event: ChangeEvent<Value>
) => void

export type OnTabPress<Value extends TabValue = TabValue> = (
  event: TabPressEvent<Value>
) => void

export type OnTabLongPress<Value extends TabValue = TabValue> = (
  event: TabLongPressEvent<Value>
) => void

export type RenderTabBar = {
  <T extends Route>(props: TabBarProps<T>): React.ReactNode
}

export type RenderTabsIndicator = (props: TabsIndicatorProps) => React.ReactNode

export interface Route {
  /**
   * You can provide your own route key.
   */
  key: string

  /**
   * The tab label.
   */
  label?: string

  /**
   * If `true`, the component is disabled.
   */
  disabled?: boolean
}

export interface TabItem<Value extends TabValue = TabValue> {
  /**
   * You can provide your own value.
   */
  value: Value

  /**
   * The tab label.
   */
  label?: string

  /**
   * If `true`, the component is disabled.
   */
  disabled?: boolean
}

export interface TabViewState<T extends Route> {
  index: number
  routes: T[]
}

export type Listener = (value: number) => void

export interface EventEmitterProps {
  addEnterListener: (listener: Listener) => () => void
}

export interface Layout {
  width: number
  height: number
}

export interface SceneProps<T extends Route = Route> {
  route: T
  index: number
  jumpTo: (key: string, animated?: boolean) => void
  position: Animated.AnimatedInterpolation<number>
}

export interface SceneRendererProps {
  layout: Layout
  jumpTo: (key: string, animated?: boolean) => void
  position: Animated.AnimatedInterpolation<number>
}

export type PagerProps = Omit<
  PagerViewProps,
  | 'children'
  | 'initialPage'
  | 'overScrollMode'
  | 'onPageScroll'
  | 'onPageSelected'
  | 'layoutDirection'
  | 'keyboardDismissMode'
  | 'onPageScrollStateChanged'
> & {
  keyboardDismissMode?: 'none' | 'on-drag' | 'auto'
  animationEnabled?: boolean
  onSwipeStart?: () => void
  onSwipeEnd?: () => void
  overScrollMode?: ScrollViewProps['overScrollMode']
}
