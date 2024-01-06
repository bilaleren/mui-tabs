import type { ClassValue } from 'clsx'

interface TabsOwnerState {
  fixed: boolean
  classes: Partial<TabsClasses>
  vertical: boolean
  scrollableX: boolean
  hideScrollbar: boolean
  scrollableY: boolean
  centered: boolean
}

export interface TabsClasses {
  root: ClassValue
  fixed: ClassValue
  centered: ClassValue
  vertical: ClassValue
  scroller: ClassValue
  indicator: ClassValue
  scrollableX: ClassValue
  scrollableY: ClassValue
  hideScrollbar: ClassValue
  flexContainer: ClassValue
  indicatorVertical: ClassValue
  flexContainerVertical: ClassValue
}

const tabsClasses: TabsClasses = {
  root: 'tabs-root',
  fixed: 'tabs-fixed',
  vertical: 'tabs-vertical',
  scroller: 'tabs-scroller',
  centered: 'tabs-centered',
  indicator: 'tabs-indicator',
  hideScrollbar: 'tabs-hide-scrollbar',
  scrollableX: 'tabs-scrollable-x',
  scrollableY: 'tabs-scrollable-y',
  flexContainer: 'tabs-flex-container',
  indicatorVertical: 'tabs-indicator-vertical',
  flexContainerVertical: 'tabs-flex-container-vertical'
}

export type UseTabsClassesReturn = Record<
  keyof Pick<
    TabsClasses,
    | 'root'
    | 'scroller'
    | 'flexContainer'
    | 'indicator'
    | 'scrollableX'
    | 'scrollableY'
    | 'hideScrollbar'
  >,
  ClassValue
>

export function useTabsClasses(
  ownerState: TabsOwnerState
): UseTabsClassesReturn {
  const {
    fixed,
    classes,
    vertical,
    centered,
    scrollableX,
    scrollableY,
    hideScrollbar
  } = ownerState

  return {
    root: [
      tabsClasses.root,
      vertical && [tabsClasses.vertical, classes.vertical],
      classes.root
    ],
    scroller: [
      tabsClasses.scroller,
      fixed && [tabsClasses.fixed, classes.fixed],
      hideScrollbar && [tabsClasses.hideScrollbar, classes.hideScrollbar],
      scrollableX && [tabsClasses.scrollableX, classes.scrollableX],
      scrollableY && [tabsClasses.scrollableY, classes.scrollableY],
      classes.scroller
    ],
    flexContainer: [
      tabsClasses.flexContainer,
      centered && [tabsClasses.centered, classes.centered],
      vertical && [
        tabsClasses.flexContainerVertical,
        classes.flexContainerVertical
      ],
      classes.flexContainer
    ],
    indicator: [
      tabsClasses.indicator,
      classes.indicator,
      vertical && tabsClasses.indicatorVertical
    ],
    hideScrollbar: hideScrollbar && [
      tabsClasses.hideScrollbar,
      classes.hideScrollbar
    ],
    scrollableX: scrollableX && [tabsClasses.scrollableX, classes.scrollableX],
    scrollableY: scrollableY && [tabsClasses.scrollableY, classes.scrollableY]
  }
}

export default tabsClasses
