import * as React from 'react'
import clsx from 'clsx'
import TabButton, { TabButtonProps } from '../TabButton'
import {
  useTabScrollButtonClasses,
  TabScrollButtonClasses
} from './tabScrollButtonClasses'
import type { ClassesWithClassValue } from '../types'

export interface TabScrollButtonProps extends TabButtonProps {
  classes?: ClassesWithClassValue<TabScrollButtonClasses>
  hideMobile?: boolean
  direction: 'left' | 'right'
  orientation?: 'vertical' | 'horizontal'
  ButtonComponent?: React.ComponentType<TabButtonProps>
}

const Icon: React.FC<React.SVGAttributes<SVGSVGElement>> = (props) => {
  const { children, ...other } = props

  return (
    <svg {...other} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  )
}

const ChevronLeft: React.FC = () => (
  <Icon>
    <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
  </Icon>
)

const ChevronRight: React.FC = () => (
  <Icon>
    <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
  </Icon>
)

const TabScrollButton: React.FC<TabScrollButtonProps> = (props) => {
  const {
    direction,
    classes: classesProp = {},
    disabled = false,
    hideMobile = true,
    className,
    orientation = 'horizontal',
    ButtonComponent = TabButton,
    ...other
  } = props

  const vertical = orientation === 'vertical'
  const classes = useTabScrollButtonClasses({
    classes: classesProp,
    disabled,
    vertical,
    hideMobile
  })
  const IconComponent = direction === 'left' ? ChevronLeft : ChevronRight

  return (
    <ButtonComponent
      {...other}
      disabled={disabled}
      className={clsx(
        className,
        classes.button,
        classes.disabled,
        classes.vertical,
        classes.hideMobile,
        classes[direction]
      )}
    >
      <IconComponent />
    </ButtonComponent>
  )
}

export default TabScrollButton
