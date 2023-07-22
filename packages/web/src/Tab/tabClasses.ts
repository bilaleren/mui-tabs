import type { ClassValue } from 'clsx'
import type { IconPosition } from '../types'
import capitalize from '@mui-tabs/utils/src/capitalize'

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
  root: ClassValue
  labelIcon: ClassValue
  fullWidth: ClassValue
  selected: ClassValue
  disabled: ClassValue
  iconWrapper: ClassValue
  flexColumn: ClassValue
  iconPositionTop: ClassValue
  iconPositionBottom: ClassValue
  iconPositionStart: ClassValue
  iconPositionEnd: ClassValue
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

export type UseTabClassesReturn = Record<
  keyof Pick<TabClasses, 'root' | 'iconWrapper'>,
  ClassValue
>

export function useTabClasses(ownerState: TabOwnerState): UseTabClassesReturn {
  const { icon, label, iconPosition, selected, disabled, fullWidth, classes } =
    ownerState

  const iconPositionKey =
    icon && iconPosition
      ? (`iconPosition${capitalize(iconPosition)}` as keyof TabClasses)
      : undefined

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
      iconPositionKey && [
        tabClasses[iconPositionKey],
        classes[iconPositionKey]
      ],
      classes.iconWrapper
    ]
  }
}

export default tabClasses
