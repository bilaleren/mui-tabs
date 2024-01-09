import type { ClassesWithClassValue } from '../types'

export interface TabScrollButtonOwnerState {
  classes: ClassesWithClassValue<TabScrollButtonClasses>
  vertical: boolean
  disabled: boolean
  hideMobile: boolean
}

export interface TabScrollButtonClasses {
  readonly button: string
  readonly left: string
  readonly right: string
  readonly vertical: string
  readonly disabled: string
  readonly hideMobile: string
}

const tabScrollButtonClasses: TabScrollButtonClasses = {
  button: 'tabs-scroll-button',
  left: 'tabs-scroll-button-left',
  right: 'tabs-scroll-button-right',
  vertical: 'tabs-scroll-button-vertical',
  disabled: 'tabs-scroll-button-disabled',
  hideMobile: 'tabs-scroll-button-hide-mobile'
}

type UseTabScrollButtonClassesReturn = Required<
  ClassesWithClassValue<TabScrollButtonClasses>
>

export const useTabScrollButtonClasses = (
  ownerState: TabScrollButtonOwnerState
): UseTabScrollButtonClassesReturn => {
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
