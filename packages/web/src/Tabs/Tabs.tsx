import * as React from 'react'
import clsx from 'clsx'
import type { TabProps } from '../Tab'
import ScrollbarSize from './ScrollbarSize'
import animate from '@mui-tabs/utils/src/animate'
import debounce from '@mui-tabs/utils/src/debounce'
import type { TabValue, ChangeHandler } from '../types'
import ownerWindow from '@mui-tabs/utils/src/ownerWindow'
import TabButton, { TabButtonProps } from '../TabButton'
import getDocumentDir from '@mui-tabs/utils/src/getDocumentDir'
import isReactFragment from '@mui-tabs/utils/src/isReactFragment'
import useEventCallback from '@mui-tabs/utils/src/useEventCallback'
import TabScrollButton, { TabScrollButtonProps } from './TabScrollButton'
import { TabsClasses, TabsOwnerState, useTabsClasses } from './tabsClasses'
import {
  detectScrollType,
  getNormalizedScrollLeft
} from '@mui-tabs/utils/src/scrollLeft'

type Maybe<T> = T | null

const TabsScrollbarSize = ScrollbarSize

export interface TabsActionRefAttributes {
  updateIndicator(): void
  updateScrollButtons(): void
}

export interface TabsProps<Value extends TabValue = any>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Callback fired when the component mounts.
   * This is useful when you want to trigger an action programmatically.
   * It supports two actions: `updateIndicator()` and `updateScrollButtons()`
   */
  action?: React.Ref<TabsActionRefAttributes>

  /**
   * The value of the currently selected `Tab`.
   * If you don't want any selected `Tab`, you can set this prop to `false`.
   */
  value?: Value

  /**
   * Props applied to the tab tab element.
   * @default {}
   */
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

  /**
   * Callback fired when the value changes.
   */
  onChange?: ChangeHandler<Value>

  /**
   * If `true`, the tabs are centered.
   * This prop is intended for large views.
   * @default false
   */
  centered?: boolean

  /**
   * The component used to render the tabs.
   */
  TabComponent?: React.ComponentType<TabButtonProps>

  /**
   * The component used to render the scroll buttons.
   */
  ScrollButtonComponent?: React.ComponentType<TabButtonProps>

  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TabsClasses>

  /**
   * The component orientation (layout flow direction).
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   *  Determines additional display behavior of the tabs:
   *
   *  - `scrollable` will invoke scrolling properties and allow for horizontally
   *  scrolling (or swiping) of the tab bar.
   *  - `fullWidth` will make the tabs grow to use all the available space,
   *  which should be used for small views, like on mobile.
   *  - `standard` will render the default state.
   * @default 'standard'
   */
  variant?: 'scrollable' | 'standard' | 'fullWidth'

  /**
   * If `true`, the scrollbar is visible. It can be useful when displaying
   * a long vertical list of tabs.
   * @default false
   */
  visibleScrollbar?: boolean

  /**
   * Determine behavior of scroll buttons when tabs are set to scroll:
   *
   * - `auto` will only present them when not all the items are visible.
   * - `true` will always present them.
   * - `false` will never present them.
   *
   * By default the scroll buttons are hidden on mobile.
   * This behavior can be disabled with `allowScrollButtonsMobile`.
   * @default 'auto'
   */
  scrollButtons?: 'auto' | boolean

  /**
   * If `true` the selected tab changes on focus. Otherwise it only
   * changes on activation.
   */
  selectionFollowsFocus?: boolean

  /**
   * If `true`, the scroll buttons aren't forced hidden on mobile.
   * By default the scroll buttons are hidden on mobile and takes precedence over `scrollButtons`.
   * @default false
   */
  allowScrollButtonsMobile?: boolean

  /**
   * Props applied to the TabScrollButton element.
   * @default {}
   */
  TabScrollButtonProps?: Partial<TabScrollButtonProps>

  /**
   * Props applied to the tab indicator element.
   * @default {}
   */
  TabIndicatorProps?: Partial<React.HTMLAttributes<HTMLSpanElement>>
}

interface TabsWithForwardRef
  extends React.ForwardRefExoticComponent<TabsProps> {
  <Value extends TabValue = any>(
    props: TabsProps<Value> & React.RefAttributes<HTMLDivElement>
  ): ReturnType<React.FC<TabsProps<Value>>>
}

const direction = getDocumentDir()
const defaultIndicatorStyle: React.CSSProperties = {}

let warnedOnceTabPresent = false

const Tabs: TabsWithForwardRef = React.forwardRef<HTMLDivElement, TabsProps>(
  (props, ref) => {
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
      TabComponent = TabButton,
      ScrollButtonComponent = TabButton,
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

    const handleScrollbarSizeChange = React.useCallback(
      (scrollbarWidth: number) => {
        setScrollerStyle({
          overflow: null,
          scrollbarWidth
        })
      },
      []
    )

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
          ButtonComponent={ScrollButtonComponent}
          className={clsx(
            classes.scrollButtons,
            TabScrollButtonProps.className
          )}
        />
      ) : null

      conditionalElements.scrollButtonEnd = showScrollButtons ? (
        <TabScrollButton
          {...TabScrollButtonProps}
          direction={isRtl ? 'left' : 'right'}
          orientation={orientation}
          onClick={handleEndScrollClick}
          disabled={!displayScroll.end}
          ButtonComponent={ScrollButtonComponent}
          className={clsx(
            classes.scrollButtons,
            TabScrollButtonProps.className
          )}
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
      <span
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

      return React.cloneElement<TabProps>(child as React.ReactElement, {
        ...TabProps,
        indicator: selected && !mounted && indicator,
        selected,
        fullWidth: variant === 'fullWidth',
        onChange,
        selectionFollowsFocus,
        ButtonComponent: TabComponent,
        value: childValue,
        className: child.props.className,
        ...(childIndex === 1 && !child.props.tabIndex ? { tabIndex: 0 } : {})
      })
    })

    const conditionalElements = getConditionalElements()

    return (
      <div {...other} ref={ref} className={clsx(classes.root, className)}>
        {conditionalElements.scrollButtonStart}
        {conditionalElements.scrollbarSizeListener}
        <div
          ref={tabsRef}
          style={{
            overflow: scrollerStyle.overflow,
            [vertical ? `margin${isRtl ? 'Left' : 'Right'}` : 'marginBottom']:
              visibleScrollbar ? undefined : -scrollerStyle.scrollbarWidth
          }}
          onScroll={handleTabsScroll}
          className={clsx(classes.scroller)}
        >
          <div
            aria-label={ariaLabel}
            aria-orientation={vertical ? 'vertical' : undefined}
            aria-labelledby={ariaLabelledBy}
            ref={tabListRef}
            role="tablist"
            className={clsx(classes.flexContainer)}
          >
            {children}
          </div>
          {mounted && indicator}
        </div>
        {conditionalElements.scrollButtonEnd}
      </div>
    )
  }
)

export default Tabs
