import type React from 'react'
import {
  FlatList,
  ViewStyle,
  ScrollView,
  SectionList,
  ScrollViewProps,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native'
import type { CollapsibleTabViewContextType } from './Context'
import type { FlashList, MasonryFlashListRef } from '@shopify/flash-list'

export type ScrollListener = (
  event: NativeSyntheticEvent<NativeScrollEvent>
) => void

export type ScrollableComponent =
  | FlatList
  | FlashList<any>
  | ScrollView
  | SectionList

export type RenderHeader = (
  props: Pick<
    CollapsibleTabViewContextType,
    'headerHeight' | 'tabBarHeight' | 'scrollOffsetY'
  >
) => React.ReactElement

export type ScrollableRef = React.RefObject<
  ScrollableComponent | MasonryFlashListRef<any>
>

export type ScrollableComponentProps = Pick<
  ScrollViewProps,
  | 'contentInset'
  | 'contentOffset'
  | 'scrollEnabled'
  | 'refreshControl'
  | 'scrollIndicatorInsets'
  | 'automaticallyAdjustContentInsets'
  | 'automaticallyAdjustsScrollIndicatorInsets'
> & {
  progressViewOffset?: number
  contentContainerStyle: ViewStyle
}
