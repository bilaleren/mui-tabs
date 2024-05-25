import type { FlatList, ScrollView, ViewStyle } from 'react-native'
import type { ScrollableRef } from './types'

export function isVirtualList(value: unknown): value is {
  scrollToOffset: FlatList['scrollToOffset']
} {
  return (
    value != null &&
    typeof value === 'object' &&
    typeof (value as any).scrollToOffset === 'function'
  )
}

export function isScrollView(value: unknown): value is {
  scrollTo: ScrollView['scrollTo']
} {
  return (
    value != null &&
    typeof value === 'object' &&
    typeof (value as any).scrollTo === 'function'
  )
}

export function scrollTo(ref: ScrollableRef, offset: number, animated = false) {
  if (isVirtualList(ref.current)) {
    ref.current.scrollToOffset({
      offset,
      animated
    })
  } else if (isScrollView(ref.current)) {
    ref.current.scrollTo({
      y: offset,
      animated
    })
  }
}

export function calculateAllPaddingVertical(
  style: ViewStyle | undefined,
  defaultPadding: number
): number {
  if (!style) {
    return defaultPadding
  }

  if (typeof style.paddingTop === 'number') {
    defaultPadding += style.paddingTop
  } else if (typeof style.paddingVertical === 'number') {
    defaultPadding += style.paddingVertical
  }

  return defaultPadding
}
