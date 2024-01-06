import * as React from 'react'
import type { TabValue } from '../types'
import animate from '@utils/animate'
import getDocumentDir from '@utils/getDocumentDir'
import useLatestCallback from 'use-latest-callback'
import { detectScrollType, getNormalizedScrollLeft } from '@utils/scrollLeft'

let warnedOnceTabPresent = false

interface TabsMeta {
  tabMeta: DOMRect | null
  tabsMeta: Record<
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'clientWidth'
    | 'scrollLeft'
    | 'scrollTop'
    | 'scrollWidth'
    | 'scrollLeftNormalized',
    number
  > | null
}

export interface UseTabsControllerProps {
  value: TabValue
  isRtl: boolean
  vertical: boolean
  start: 'top' | 'left'
  end: 'bottom' | 'right'
  clientSize: 'clientHeight' | 'clientWidth'
  scrollStart: 'scrollTop' | 'scrollLeft'
}

export interface UseTabsController {
  tabsRef: React.MutableRefObject<HTMLDivElement | null>
  tabListRef: React.MutableRefObject<HTMLDivElement | null>
  valueToIndexRef: React.MutableRefObject<Map<TabValue, number>>
  scroll: (scrollValue: number, animated?: boolean) => void
  moveTabsScroll: (delta: number) => void
  getTabsMeta: () => TabsMeta
  getScrollSize: () => number
  scrollSelectedIntoView: (animated: boolean) => void
  moveTabsScrollToStart: () => void
  moveTabsScrollToEnd: () => void
}

function useTabsController(props: UseTabsControllerProps): UseTabsController {
  const { value, isRtl, start, end, vertical, clientSize, scrollStart } = props

  const tabsRef = React.useRef<HTMLDivElement | null>(null)
  const tabListRef = React.useRef<HTMLDivElement | null>(null)
  const valueToIndexRef = React.useRef<Map<TabValue, number>>(new Map())

  const getTabsMeta = React.useCallback((): TabsMeta => {
    const tabsNode = tabsRef.current
    const valueToIndex = valueToIndexRef.current

    let tabsMeta = null

    if (tabsNode) {
      const rect = tabsNode.getBoundingClientRect()
      // create a new object with ClientRect class props + scrollLeft
      tabsMeta = {
        clientWidth: tabsNode.clientWidth,
        scrollLeft: tabsNode.scrollLeft,
        scrollTop: tabsNode.scrollTop,
        scrollLeftNormalized: getNormalizedScrollLeft(
          tabsNode,
          getDocumentDir()
        ),
        scrollWidth: tabsNode.scrollWidth,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right
      }
    }

    let tabMeta: DOMRect | null = null

    if (tabsNode && value !== false && tabListRef.current) {
      const children = tabListRef.current.children

      if (children.length > 0) {
        const tab = children[valueToIndex.get(value)!]

        if (!tab && process.env.NODE_ENV !== 'production') {
          console.error(
            [
              `The \`value\` provided to the Tabs component is invalid.`,
              `None of the Tabs' children match with "${value}".`,
              valueToIndex.keys
                ? `You can provide one of the following values: ${Array.from(
                    valueToIndex.keys()
                  ).join(', ')}.`
                : null
            ].join('\n')
          )
        }

        tabMeta = tab ? tab.getBoundingClientRect() : null

        if (
          process.env.NODE_ENV !== 'test' &&
          process.env.NODE_ENV !== 'production' &&
          !warnedOnceTabPresent &&
          tabMeta &&
          tabMeta.width === 0 &&
          tabMeta.height === 0
        ) {
          tabsMeta = null

          console.error(
            [
              'The `value` provided to the Tabs component is invalid.',
              `The Tab with this \`value\` ("${value}") is not part of the document layout.`,
              "Make sure the tab item is present in the document or that it's not `display: none`."
            ].join('\n')
          )

          warnedOnceTabPresent = true
        }
      }
    }

    return { tabsMeta, tabMeta }
  }, [value])

  const scroll = React.useCallback(
    (scrollValue: number, animated = true) => {
      const tabs = tabsRef.current

      if (!tabs) {
        return
      }

      if (animated) {
        animate({
          element: tabs,
          to: scrollValue,
          property: scrollStart,
          duration: 300
        })
      } else {
        tabs[scrollStart] = scrollValue
      }
    },
    [scrollStart]
  )

  const moveTabsScroll = React.useCallback(
    (delta: number) => {
      const tabs = tabsRef.current

      if (!tabs) {
        return
      }

      let scrollValue = tabs[scrollStart]

      if (vertical) {
        scrollValue += delta
      } else {
        scrollValue += delta * (isRtl ? -1 : 1)
        // Fix for Edge
        scrollValue *= isRtl && detectScrollType() === 'reverse' ? -1 : 1
      }

      scroll(scrollValue)
    },
    [isRtl, scroll, vertical, scrollStart]
  )

  const getScrollSize = React.useCallback((): number => {
    const tabs = tabsRef.current
    const tabList = tabListRef.current

    if (!tabs || !tabList) {
      return 0
    }

    const containerSize = tabs[clientSize]
    let totalSize = 0
    const children = Array.from(tabList.children)

    for (let i = 0; i < children.length; i += 1) {
      const tab = children[i]

      if (totalSize + tab[clientSize] > containerSize) {
        break
      }

      totalSize += tab[clientSize]
    }

    return totalSize
  }, [clientSize])

  const scrollSelectedIntoView = useLatestCallback((animated: boolean) => {
    const { tabsMeta, tabMeta } = getTabsMeta()

    if (!tabMeta || !tabsMeta) {
      return
    }

    let nextScrollStart: number | null = null

    if (tabMeta[start] < tabsMeta[start]) {
      // left side of button is out of view
      nextScrollStart =
        tabsMeta[scrollStart] + (tabMeta[start] - tabsMeta[start])
    } else if (tabMeta[end] > tabsMeta[end]) {
      // right side of button is out of view
      nextScrollStart = tabsMeta[scrollStart] + (tabMeta[end] - tabsMeta[end])
    }

    if (nextScrollStart !== null) {
      scroll(nextScrollStart, animated)
    }
  })

  const moveTabsScrollToStart = useLatestCallback(() => {
    moveTabsScroll(-1 * getScrollSize())
  })

  const moveTabsScrollToEnd = useLatestCallback(() => {
    moveTabsScroll(getScrollSize())
  })

  return {
    tabsRef,
    tabListRef,
    valueToIndexRef,
    scroll,
    moveTabsScroll,
    getTabsMeta,
    getScrollSize,
    scrollSelectedIntoView,
    moveTabsScrollToStart,
    moveTabsScrollToEnd
  }
}

export default useTabsController
