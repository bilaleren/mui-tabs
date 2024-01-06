import type { ClassValue } from 'clsx'

interface TabScrollButtonOwnerState {
  classes: Partial<TabScrollButtonClasses>
  vertical: boolean
  disabled: boolean
  hideMobile: boolean
}

export interface TabScrollButtonClasses {
  button: ClassValue
  left: ClassValue
  right: ClassValue
  vertical: ClassValue
  disabled: ClassValue
  hideMobile: ClassValue
}

const tabScrollButtonClasses: TabScrollButtonClasses = {
  button: 'tabs-scroll-button',
  left: 'tabs-scroll-button-left',
  right: 'tabs-scroll-button-right',
  vertical: 'tabs-scroll-button-vertical',
  disabled: 'tabs-scroll-button-disabled',
  hideMobile: 'tabs-scroll-button-hide-mobile'
}

export const useTabScrollButtonClasses = (
  ownerState: TabScrollButtonOwnerState
): TabScrollButtonClasses => {
  const { classes, hideMobile, vertical, disabled } = ownerState

  return {
    button: [tabScrollButtonClasses.button, classes.button],
    left: [tabScrollButtonClasses.left, classes.left],
    right: [tabScrollButtonClasses.right, classes.right],
    vertical: vertical && [tabScrollButtonClasses.vertical, classes.vertical],
    disabled: disabled && [tabScrollButtonClasses.disabled, classes.disabled],
    hideMobile: hideMobile && [
      tabScrollButtonClasses.hideMobile,
      classes.hideMobile
    ]
  }
}

export default tabScrollButtonClasses
