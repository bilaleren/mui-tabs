import * as React from 'react'
import clsx from 'clsx'
import type { TabProps } from '../Tab'
import animate from '../utils/animate'
import debounce from '../utils/debounce'
import ScrollbarSize from './ScrollbarSize'
import ownerWindow from '../utils/ownerWindow'
import getDocumentDir from '../utils/getDocumentDir'
import isReactFragment from '../utils/isReactFragment'
import useEventCallback from '../utils/useEventCallback'
import TabButton, { TabButtonProps } from '../TabButton'
import TabScrollButton, { TabScrollButtonProps } from './TabScrollButton'
import { TabsClasses, TabsOwnerState, useTabsClasses } from './tabsClasses'
import { detectScrollType, getNormalizedScrollLeft } from '../utils/scrollLeft'

type Maybe<T> = T | null

const TabsRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <div {...props} ref={ref} />)

const TabsScroller = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <div {...props} ref={ref} />)

const FlexContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <div {...props} ref={ref} />)

const TabsIndicator = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>((props, ref) => <span {...props} ref={ref} />)

const TabsScrollbarSize = ScrollbarSize

export interface TabsActionRefAttributes {
  updateIndicator: () => void
  updateScrollButtons: () => void
}

export interface TabsProps<V extends string | number | boolean = any>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  action?: React.Ref<TabsActionRefAttributes>
  value?: V
  TabProps?: Partial<
    Omit<
      TabProps,
      | 'value'
      | 'onChange'
      | 'selected'
      | 'indicator'
      | 'fullWidth'
      | 'ButtonComponent'
    >
  >
  onChange?: (value: V, event: React.SyntheticEvent<HTMLButtonElement>) => void
  centered?: boolean
  ButtonComponent?: React.ComponentType<TabButtonProps>
  classes?: Partial<TabsClasses>
  orientation?: 'horizontal' | 'vertical'
  variant?: 'scrollable' | 'standard' | 'fullWidth'
  visibleScrollbar?: boolean
  scrollButtons?: 'auto' | boolean
  selectionFollowsFocus?: boolean
  allowScrollButtonsMobile?: boolean
  TabScrollButtonProps?: Partial<TabScrollButtonProps>
  TabIndicatorProps?: Partial<React.HTMLAttributes<HTMLSpanElement>>
}

const direction = getDocumentDir()
const defaultIndicatorStyle: React.CSSProperties = {}

let warnedOnceTabPresent = false

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    children: childrenProp,
    action,
    value,
    centered = false,
    onChange,
    classes: classesProp = {},
    className,
    TabProps = {},
    variant = 'standard',
    selectionFollowsFocus,
    scrollButtons = 'auto',
    TabIndicatorProps = {},
    ButtonComponent = TabButton,
    TabScrollButtonProps = {},
    orientation = 'horizontal',
    visibleScrollbar = false,
    allowScrollButtonsMobile = false,
    ...other
  } = props

  const isRtl = direction === 'rtl'
  const scrollable = variant === 'scrollable'
  const vertical = orientation === 'vertical'

  const scrollStart = vertical ? 'scrollTop' : 'scrollLeft'
  const start = vertical ? 'top' : 'left'
  const end = vertical ? 'bottom' : 'right'
  const clientSize = vertical ? 'clientHeight' : 'clientWidth'
  const size = vertical ? 'height' : 'width'

  const ownerState: TabsOwnerState = {
    classes: classesProp,
    vertical,
    hideScrollbar: scrollable && !visibleScrollbar,
    fixed: !scrollable,
    scrollableX: scrollable && !vertical,
    scrollableY: scrollable && vertical,
    centered: centered && !scrollable,
    scrollButtonsHideMobile: !allowScrollButtonsMobile
  }

  const classes = useTabsClasses(ownerState)

  const [mounted, setMounted] = React.useState(false)
  const [indicatorStyle, setIndicatorStyle] =
    React.useState<React.CSSProperties>(defaultIndicatorStyle)
  const [displayScroll, setDisplayScroll] = React.useState({
    start: false,
    end: false
  })

  const [scrollerStyle, setScrollerStyle] = React.useState<any>({
    overflow: 'hidden',
    scrollbarWidth: 0
  })

  const valueToIndex = new Map<TabsProps['value'], number>()
  const tabsRef = React.useRef<Maybe<HTMLDivElement>>(null)
  const tabListRef = React.useRef<Maybe<HTMLDivElement>>(null)

  const getTabsMeta = () => {
    const tabsNode = tabsRef.current

    let tabsMeta = null

    if (tabsNode) {
      const rect = tabsNode.getBoundingClientRect()
      // create a new object with ClientRect class props + scrollLeft
      tabsMeta = {
        clientWidth: tabsNode.clientWidth,
        scrollLeft: tabsNode.scrollLeft,
        scrollTop: tabsNode.scrollTop,
        scrollLeftNormalized: getNormalizedScrollLeft(tabsNode, direction),
        scrollWidth: tabsNode.scrollWidth,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right
      }
    }

    let tabMeta: Maybe<DOMRect> = null

    if (tabsNode && value !== false && tabListRef.current) {
      const children = tabListRef.current.children

      if (children.length > 0) {
        const tab = children[valueToIndex.get(value) as number]

        if (process.env.NODE_ENV !== 'production') {
          if (!tab) {
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
        }

        tabMeta = tab ? tab.getBoundingClientRect() : null

        if (process.env.NODE_ENV !== 'production') {
          if (
            process.env.NODE_ENV !== 'test' &&
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
    }

    return { tabsMeta, tabMeta }
  }

  const updateIndicatorState = useEventCallback(() => {
    const { tabsMeta, tabMeta } = getTabsMeta()
    let startValue = 0
    let startIndicator: keyof DOMRect

    if (vertical) {
      startIndicator = 'top'
      if (tabMeta && tabsMeta) {
        startValue = tabMeta.top - tabsMeta.top + tabsMeta.scrollTop
      }
    } else {
      startIndicator = isRtl ? 'right' : 'left'
      if (tabMeta && tabsMeta) {
        const correction = isRtl
          ? tabsMeta.scrollLeftNormalized +
            tabsMeta.clientWidth -
            tabsMeta.scrollWidth
          : tabsMeta.scrollLeft
        startValue =
          (isRtl ? -1 : 1) *
          (tabMeta[startIndicator] - tabsMeta[startIndicator] + correction)
      }
    }

    const newIndicatorStyle = {
      [startIndicator]: startValue,
      // May be wrong until the font is loaded.
      [size]: tabMeta ? tabMeta[size] : 0
    }

    // IE11 support, replace with Number.isNaN
    // eslint-disable-next-line no-restricted-globals
    if (
      isNaN(Number(indicatorStyle[startIndicator])) ||
      isNaN(Number(indicatorStyle[size]))
    ) {
      setIndicatorStyle(newIndicatorStyle)
    } else {
      const dStart = Math.abs(
        (indicatorStyle[startIndicator] as number) -
          newIndicatorStyle[startIndicator]
      )
      const dSize = Math.abs(
        (indicatorStyle[size] as number) - newIndicatorStyle[size]
      )

      if (dStart >= 1 || dSize >= 1) {
        setIndicatorStyle(newIndicatorStyle)
      }
    }
  })

  const scroll = (scrollValue: number, animation = true) => {
    const tabs = tabsRef.current

    if (!tabs) {
      return
    }

    if (animation) {
      animate({
        element: tabs,
        to: scrollValue,
        property: scrollStart,
        duration: 300
      })
    } else {
      tabs[scrollStart] = scrollValue
    }
  }

  const moveTabsScroll = (delta: number) => {
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
  }

  const getScrollSize = (): number => {
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
  }

  const handleStartScrollClick = () => {
    moveTabsScroll(-1 * getScrollSize())
  }

  const handleEndScrollClick = () => {
    moveTabsScroll(getScrollSize())
  }

  const handleScrollbarSizeChange = React.useCallback((scrollbarWidth) => {
    setScrollerStyle({
      overflow: null,
      scrollbarWidth
    })
  }, [])

  const getConditionalElements = () => {
    const conditionalElements: any = {}

    conditionalElements.scrollbarSizeListener = scrollable ? (
      <TabsScrollbarSize
        onChange={handleScrollbarSizeChange}
        className={clsx(
          classes.scrollableX,
          classes.scrollableY,
          classes.hideScrollbar
        )}
      />
    ) : null

    const scrollButtonsActive = displayScroll.start || displayScroll.end
    const showScrollButtons =
      scrollable &&
      ((scrollButtons === 'auto' && scrollButtonsActive) ||
        scrollButtons === true)

    conditionalElements.scrollButtonStart = showScrollButtons ? (
      <TabScrollButton
        direction={isRtl ? 'right' : 'left'}
        orientation={orientation}
        onClick={handleStartScrollClick}
        disabled={!displayScroll.start}
        {...TabScrollButtonProps}
        ButtonComponent={ButtonComponent}
        className={clsx(classes.scrollButtons, TabScrollButtonProps.className)}
      />
    ) : null

    conditionalElements.scrollButtonEnd = showScrollButtons ? (
      <TabScrollButton
        {...TabScrollButtonProps}
        direction={isRtl ? 'left' : 'right'}
        orientation={orientation}
        onClick={handleEndScrollClick}
        disabled={!displayScroll.end}
        ButtonComponent={ButtonComponent}
        className={clsx(classes.scrollButtons, TabScrollButtonProps.className)}
      />
    ) : null

    return conditionalElements
  }

  const scrollSelectedIntoView = useEventCallback((animation: boolean) => {
    const { tabsMeta, tabMeta } = getTabsMeta()

    if (!tabMeta || !tabsMeta) {
      return
    }

    let nextScrollStart: Maybe<number> = null

    if (tabMeta[start] < tabsMeta[start]) {
      // left side of button is out of view
      nextScrollStart =
        tabsMeta[scrollStart] + (tabMeta[start] - tabsMeta[start])
    } else if (tabMeta[end] > tabsMeta[end]) {
      // right side of button is out of view
      nextScrollStart = tabsMeta[scrollStart] + (tabMeta[end] - tabsMeta[end])
    }

    if (nextScrollStart !== null) {
      scroll(nextScrollStart, animation)
    }
  })

  const updateScrollButtonState = useEventCallback(() => {
    const tabs = tabsRef.current

    if (scrollable && scrollButtons !== false && tabs) {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollWidth,
        clientWidth
      } = tabs
      let showStartScroll
      let showEndScroll

      if (vertical) {
        showStartScroll = scrollTop > 1
        showEndScroll = scrollTop < scrollHeight - clientHeight - 1
      } else {
        const scrollLeft = getNormalizedScrollLeft(tabs, direction)
        // use 1 for the potential rounding error with browser zooms.
        showStartScroll = isRtl
          ? scrollLeft < scrollWidth - clientWidth - 1
          : scrollLeft > 1
        showEndScroll = !isRtl
          ? scrollLeft < scrollWidth - clientWidth - 1
          : scrollLeft > 1
      }

      if (
        showStartScroll !== displayScroll.start ||
        showEndScroll !== displayScroll.end
      ) {
        setDisplayScroll({ start: showStartScroll, end: showEndScroll })
      }
    }
  })

  React.useEffect(() => {
    const tabs = tabsRef.current
    const tabList = tabListRef.current

    if (!tabs || !tabList) {
      return
    }

    const handleResize = debounce(() => {
      updateIndicatorState()
      updateScrollButtonState()
    })

    const win = ownerWindow(tabs)

    win.addEventListener('resize', handleResize)

    let resizeObserver: ResizeObserver

    if (typeof ResizeObserver !== 'undefined') {
      // eslint-disable-next-line no-undef
      resizeObserver = new ResizeObserver(handleResize)

      Array.from(tabList.children).forEach((child) => {
        resizeObserver.observe(child)
      })
    }

    return () => {
      handleResize.clear()
      win.removeEventListener('resize', handleResize)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [updateIndicatorState, updateScrollButtonState])

  const handleTabsScroll = React.useMemo(
    () =>
      debounce(() => {
        updateScrollButtonState()
      }),
    [updateScrollButtonState]
  )

  React.useEffect(() => {
    return () => {
      handleTabsScroll.clear()
    }
  }, [handleTabsScroll])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    updateIndicatorState()
    updateScrollButtonState()
  })

  React.useEffect(() => {
    // Don't animate on the first render.
    scrollSelectedIntoView(defaultIndicatorStyle !== indicatorStyle)
  }, [scrollSelectedIntoView, indicatorStyle])

  React.useImperativeHandle(
    action,
    () => ({
      updateIndicator: updateIndicatorState,
      updateScrollButtons: updateScrollButtonState
    }),
    [updateIndicatorState, updateScrollButtonState]
  )

  let childIndex = 0

  const indicator = (
    <TabsIndicator
      {...TabIndicatorProps}
      style={{
        ...indicatorStyle,
        ...TabIndicatorProps.style
      }}
      className={clsx(classes.indicator, TabIndicatorProps.className)}
    />
  )

  const children = React.Children.map(childrenProp, (child) => {
    if (!React.isValidElement(child)) {
      return null
    }

    if (process.env.NODE_ENV !== 'production') {
      if (isReactFragment(child)) {
        console.error(
          [
            "The Tabs component doesn't accept a Fragment as a child.",
            'Consider providing an array instead.'
          ].join('\n')
        )
      }
    }

    const childValue =
      child.props.value === undefined ? childIndex : child.props.value

    valueToIndex.set(childValue, childIndex)

    const selected = childValue === value

    childIndex += 1

    return React.cloneElement(child, {
      ...TabProps,
      indicator: selected && !mounted && indicator,
      selected,
      ButtonComponent,
      fullWidth: variant === 'fullWidth',
      onChange,
      selectionFollowsFocus,
      value: childValue,
      className: child.props.className,
      ...(childIndex === 1 && !child.props.tabIndex ? { tabIndex: 0 } : {})
    })
  })

  const conditionalElements = getConditionalElements()

  return (
    <TabsRoot
      {...(other as any)}
      ref={ref}
      className={clsx(classes.root, className)}
    >
      {conditionalElements.scrollButtonStart}
      {conditionalElements.scrollbarSizeListener}
      <TabsScroller
        ref={tabsRef}
        style={{
          overflow: scrollerStyle.overflow,
          [vertical ? `margin${isRtl ? 'Left' : 'Right'}` : 'marginBottom']:
            visibleScrollbar ? undefined : -scrollerStyle.scrollbarWidth
        }}
        onScroll={handleTabsScroll}
        className={clsx(classes.scroller)}
      >
        <FlexContainer
          aria-label={ariaLabel}
          aria-orientation={vertical ? 'vertical' : undefined}
          aria-labelledby={ariaLabelledBy}
          ref={tabListRef}
          role="tablist"
          className={clsx(classes.flexContainer)}
        >
          {children}
        </FlexContainer>
        {mounted && indicator}
      </TabsScroller>
      {conditionalElements.scrollButtonEnd}
    </TabsRoot>
  )
})

export default Tabs as <V extends number | string | boolean = any>(
  props: React.PropsWithChildren<TabsProps<V>> &
    React.RefAttributes<HTMLDivElement>
) => JSX.Element
