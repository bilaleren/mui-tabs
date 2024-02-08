import * as React from 'react'
import clsx from 'clsx'
import type { TabProps } from '../Tab'
import ScrollbarSize from './ScrollbarSize'
import debounce from '@utils/debounce'
import useLatestCallback from 'use-latest-callback'
import type {
  TabValue,
  TabsVariant,
  ChangeHandler,
  TabsOrientation,
  ClassesWithClassValue
} from '../types'
import TabButton, { TabButtonProps } from '../TabButton'
import animate from '@utils/animate'
import ownerWindow from '@utils/ownerWindow'
import getDocumentDir from '@utils/getDocumentDir'
import isReactFragment from '@utils/isReactFragment'
import TabScrollButton, { TabScrollButtonProps } from '../TabScrollButton'
import { useTabsClasses, TabsClasses } from './tabsClasses'
import { detectScrollType, getNormalizedScrollLeft } from '@utils/scrollLeft'

export interface TabsRefAttributes {
  updateIndicator: () => void
  updateScrollButtons: () => void
}

type BaseTabsProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>

export interface TabsProps<Value extends TabValue = any> extends BaseTabsProps {
  /**
   * The value of the currently selected `Tab`.
   * If you don't want any selected `Tab`, you can set this prop to `false`.
   */
  value?: Value

  /**
   * Props applied to the tab element.
   * @default {}
   */
  tabProps?: Partial<
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
  classes?: ClassesWithClassValue<TabsClasses>

  /**
   * The component orientation (layout flow direction).
   * @default 'horizontal'
   */
  orientation?: TabsOrientation

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
  variant?: TabsVariant

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
   * By default, the scroll buttons are hidden on mobile.
   * This behavior can be disabled with `allowScrollButtonsMobile`.
   * @default 'auto'
   */
  scrollButtons?: 'auto' | boolean

  /**
   * If `true` the selected tab changes on focus. Otherwise, it only
   * changes on activation.
   */
  selectionFollowsFocus?: boolean

  /**
   * If `true`, the scroll buttons aren't forced hidden on mobile.
   * By default, the scroll buttons are hidden on mobile and takes precedence over `scrollButtons`.
   * @default false
   */
  allowScrollButtonsMobile?: boolean

  /**
   * Props applied to the tab indicator element.
   * @default {}
   */
  indicatorProps?: Partial<React.HTMLAttributes<HTMLSpanElement>>

  /**
   * Props applied to the TabScrollButton element.
   * @default {}
   */
  scrollButtonsProps?: Partial<
    Omit<
      TabScrollButtonProps,
      'direction' | 'disabled' | 'orientation' | 'onClick' | 'ButtonComponent'
    >
  >
}

interface TabsComponent extends React.ForwardRefExoticComponent<TabsProps> {
  <Value extends TabValue = any>(
    props: TabsProps<Value> & React.RefAttributes<TabsRefAttributes>
  ): ReturnType<React.FC<TabsProps<Value>>>
}

let warnedOnceTabPresent = false

const defaultIndicatorStyle: React.CSSProperties = {}

const Tabs: TabsComponent = React.forwardRef<TabsRefAttributes, TabsProps>(
  (props, ref) => {
    const {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children: childrenProp,
      value,
      centered = false,
      onChange,
      classes: classesProp = {},
      className,
      tabProps = {},
      variant = 'standard',
      selectionFollowsFocus,
      scrollButtons = 'auto',
      indicatorProps = {},
      scrollButtonsProps = {},
      TabComponent = TabButton,
      ScrollButtonComponent = TabButton,
      orientation = 'horizontal',
      visibleScrollbar = false,
      allowScrollButtonsMobile = false,
      ...other
    } = props

    const tabsRef = React.useRef<HTMLDivElement | null>(null)
    const tabListRef = React.useRef<HTMLDivElement | null>(null)
    const valueToIndexRef = React.useRef<Map<TabValue, number>>(new Map())

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

    const documentDir = getDocumentDir()
    const isRtl = documentDir === 'rtl'
    const scrollable = variant === 'scrollable'
    const vertical = orientation === 'vertical'

    const scrollStart = vertical ? 'scrollTop' : 'scrollLeft'
    const start = vertical ? 'top' : 'left'
    const end = vertical ? 'bottom' : 'right'
    const clientSize = vertical ? 'clientHeight' : 'clientWidth'
    const size = vertical ? 'height' : 'width'

    const classes = useTabsClasses({
      classes: classesProp,
      vertical,
      hideScrollbar: scrollable && !visibleScrollbar,
      fixed: !scrollable,
      scrollableX: scrollable && !vertical,
      scrollableY: scrollable && vertical,
      centered: centered && !scrollable
    })

    const scrollButtonsActive = displayScroll.start || displayScroll.end
    const showScrollButtons =
      scrollable &&
      ((scrollButtons === 'auto' && scrollButtonsActive) ||
        scrollButtons === true)

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

    const getTabsMeta = React.useCallback(() => {
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

    const updateIndicatorState = useLatestCallback(() => {
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
        [size]: tabMeta?.[size] ?? 0
      }

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

    const updateScrollButtonState = useLatestCallback(() => {
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
          const scrollLeft = getNormalizedScrollLeft(tabs, documentDir)
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
          setDisplayScroll({
            start: showStartScroll,
            end: showEndScroll
          })
        }
      }
    })

    const handleScrollbarSizeChange = React.useCallback(
      (scrollbarWidth: number) => {
        setScrollerStyle({
          overflow: null,
          scrollbarWidth
        })
      },
      []
    )

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
      () => debounce(updateScrollButtonState),
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
      ref,
      () => ({
        updateIndicator: updateIndicatorState,
        updateScrollButtons: updateScrollButtonState
      }),
      [updateIndicatorState, updateScrollButtonState]
    )

    const indicator = (
      <span
        {...indicatorProps}
        style={{
          ...indicatorProps.style,
          ...indicatorStyle
        }}
        className={clsx(classes.indicator, indicatorProps.className)}
      />
    )

    const children = React.Children.map(childrenProp, (child, index) => {
      if (!React.isValidElement(child)) {
        return null
      }

      if (process.env.NODE_ENV !== 'production' && isReactFragment(child)) {
        console.error(
          [
            "The Tabs component doesn't accept a Fragment as a child.",
            'Consider providing an array instead.'
          ].join('\n')
        )
      }

      const props = child.props as Record<string, any>
      const childValue = props.value === undefined ? index : props.value
      const selected = childValue === value

      valueToIndexRef.current.set(childValue, index)

      return React.cloneElement(child as React.ReactElement<TabProps>, {
        ...tabProps,
        selected,
        onChange,
        value: childValue,
        indicator: selected && !mounted && indicator,
        className: props.className,
        fullWidth: variant === 'fullWidth',
        selectionFollowsFocus,
        ButtonComponent: TabComponent,
        ...(index === 1 && !props.tabIndex ? { tabIndex: 0 } : {})
      })
    })

    return (
      <div {...other} className={clsx(classes.root, className)}>
        {showScrollButtons && (
          <TabScrollButton
            {...scrollButtonsProps}
            className={clsx(
              classes.scrollButtons,
              scrollButtonsProps.className
            )}
            direction={isRtl ? 'right' : 'left'}
            hideMobile={!allowScrollButtonsMobile}
            orientation={orientation}
            onClick={moveTabsScrollToStart}
            disabled={!displayScroll.start}
            ButtonComponent={ScrollButtonComponent}
          />
        )}

        {scrollable && (
          <ScrollbarSize
            onChange={handleScrollbarSizeChange}
            className={clsx(
              classes.scrollableX,
              classes.scrollableY,
              classes.hideScrollbar
            )}
          />
        )}

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

        {showScrollButtons && (
          <TabScrollButton
            {...scrollButtonsProps}
            className={clsx(
              classes.scrollButtons,
              scrollButtonsProps.className
            )}
            direction={isRtl ? 'left' : 'right'}
            hideMobile={!allowScrollButtonsMobile}
            orientation={orientation}
            onClick={moveTabsScrollToEnd}
            disabled={!displayScroll.end}
            ButtonComponent={ScrollButtonComponent}
          />
        )}
      </div>
    )
  }
)

export default Tabs
