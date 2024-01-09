import type { ClassValue } from 'clsx'
import type { ClassesWithClassValue } from '../types'
import tabScrollButtonClasses from '../TabScrollButton/tabScrollButtonClasses'

export interface TabsOwnerState {
  fixed: boolean
  classes: ClassesWithClassValue<TabsClasses>
  vertical: boolean
  scrollableX: boolean
  hideScrollbar: boolean
  scrollableY: boolean
  centered: boolean
}

export interface TabsClasses {
  readonly root: string
  readonly fixed: string
  readonly centered: string
  readonly vertical: string
  readonly scroller: string
  readonly indicator: string
  readonly scrollableX: string
  readonly scrollableY: string
  readonly hideScrollbar: string
  readonly flexContainer: string
  readonly scrollButtons: string
  readonly indicatorVertical: string
  readonly flexContainerVertical: string
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
  scrollButtons: tabScrollButtonClasses.button,
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
    | 'scrollButtons'
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
    scrollButtons: classes.scrollButtons,
    hideScrollbar: hideScrollbar && [
      tabsClasses.hideScrollbar,
      classes.hideScrollbar
    ],
    scrollableX: scrollableX && [tabsClasses.scrollableX, classes.scrollableX],
    scrollableY: scrollableY && [tabsClasses.scrollableY, classes.scrollableY]
  }
}

export default tabsClasses
