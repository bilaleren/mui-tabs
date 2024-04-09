import { useEvent, useHandler } from 'react-native-reanimated'
import type { PagerViewOnPageScrollEvent } from 'react-native-pager-view'

function usePageScrollHandler(
  handlers: {
    onPageScroll: (
      event: PagerViewOnPageScrollEvent['nativeEvent'],
      context: unknown
    ) => unknown
  },
  dependencies?: unknown[]
) {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies)
  const subscribeForEvents = ['onPageScroll']

  return useEvent<any>(
    (event) => {
      'worklet'
      const { onPageScroll } = handlers
      if (onPageScroll && event.eventName.endsWith('onPageScroll')) {
        onPageScroll(event, context)
      }
    },
    subscribeForEvents,
    doDependenciesDiffer
  )
}

export default usePageScrollHandler
