import type { ClassValue } from 'clsx'

export interface TabsOwnerState {
  fixed: boolean
  classes: Partial<TabsClasses>
  vertical: boolean
  scrollableX: boolean
  hideScrollbar: boolean
  scrollableY: boolean
  centered: boolean
  scrollButtonsHideMobile: boolean
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
  scrollButtons: ClassValue
  flexContainer: ClassValue
  indicatorVertical: ClassValue
  flexContainerVertical: ClassValue
  scrollButtonsHideMobile: ClassValue
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
  scrollButtons: 'tabs-scroll-buttons',
  flexContainer: 'tabs-flex-container',
  indicatorVertical: 'tabs-indicator-vertical',
  flexContainerVertical: 'tabs-flex-container-vertical',
  scrollButtonsHideMobile: 'tabs-scroll-buttons-hide-mobile'
}

export type UseTabsClassesReturn = Record<
  keyof Pick<
    TabsClasses,
    | 'root'
    | 'scroller'
    | 'flexContainer'
    | 'indicator'
    | 'scrollButtons'
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
    hideScrollbar,
    scrollButtonsHideMobile
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
    scrollButtons: [
      tabsClasses.scrollButtons,
      scrollButtonsHideMobile && [
        tabsClasses.scrollButtonsHideMobile,
        classes.scrollButtonsHideMobile
      ],
      classes.scrollButtons
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
