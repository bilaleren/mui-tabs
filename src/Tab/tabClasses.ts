import type { ClassArray } from 'clsx'
import capitalize from '../utils/capitalize'

export type IconPosition = 'top' | 'start' | 'end' | 'bottom'

export interface TabOwnerState {
  icon: boolean
  label: boolean
  disabled: boolean
  selected: boolean
  fullWidth: boolean
  classes: Partial<TabClasses>
  iconPosition: IconPosition
}

export interface TabClasses {
  root: string
  labelIcon: string
  fullWidth: string
  selected: string
  disabled: string
  iconWrapper: string
  flexColumn: string
  iconPositionTop: string
  iconPositionBottom: string
  iconPositionStart: string
  iconPositionEnd: string
}

const tabClasses: TabClasses = {
  root: 'tab-root',
  labelIcon: 'tab-label-icon',
  fullWidth: 'tab-full-width',
  selected: 'tab-selected',
  disabled: 'tab-disabled',
  flexColumn: 'tab-flex-column',
  iconWrapper: 'tab-icon-wrapper',
  iconPositionTop: 'tab-icon-position-top',
  iconPositionBottom: 'tab-icon-position-bottom',
  iconPositionStart: 'tab-icon-position-start',
  iconPositionEnd: 'tab-icon-position-end'
}

export const useTabClasses = (
  ownerState: TabOwnerState
): Record<keyof Pick<TabClasses, 'root' | 'iconWrapper'>, ClassArray> => {
  const { icon, label, iconPosition, selected, disabled, fullWidth, classes } =
    ownerState

  const positionSuffix = iconPosition ? capitalize(iconPosition) : undefined

  return {
    root: [
      tabClasses.root,
      icon && label && [tabClasses.labelIcon, classes.labelIcon],
      fullWidth && [tabClasses.fullWidth, classes.fullWidth],
      selected && [tabClasses.selected, classes.selected],
      disabled && [tabClasses.disabled, classes.disabled],
      icon &&
        label &&
        (iconPosition === 'top' || iconPosition === 'bottom') && [
          tabClasses.flexColumn,
          classes.flexColumn
        ]
    ],
    iconWrapper: [
      tabClasses.iconWrapper,
      icon &&
        positionSuffix && [
          tabClasses[`iconPosition${positionSuffix}`],
          classes[`iconPosition${positionSuffix}`]
        ],
      classes.iconWrapper
    ]
  }
}

export default tabClasses
