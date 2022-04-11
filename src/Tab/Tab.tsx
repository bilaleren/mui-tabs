import * as React from 'react'
import clsx from 'clsx'
import TabButton, { TabButtonProps } from '../TabButton'
import {
  useTabClasses,
  TabClasses,
  IconPosition,
  TabOwnerState
} from './tabClasses'

type ButtonAttributes = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'onChange'
>

export interface TabProps extends ButtonAttributes {
  value?: string | number | boolean
  label?: React.ReactNode
  icon?: React.ReactNode
  classes?: Partial<TabClasses>
  ButtonComponent?: React.ComponentType<TabButtonProps>
  iconPosition?: IconPosition
  indicator?: React.ReactNode
  fullWidth?: boolean
  onChange?: (
    value: TabProps['value'],
    event: React.FormEvent<HTMLButtonElement>
  ) => void
  selectionFollowsFocus?: boolean
  selected?: boolean
}

const Tab = React.forwardRef<HTMLButtonElement, TabProps>((props, ref) => {
  const {
    value,
    label: labelProp,
    icon: iconProp,
    fullWidth = false,
    iconPosition = 'top',
    selected = false,
    className,
    disabled = false,
    indicator,
    children,
    onFocus,
    classes: classesProp = {},
    onClick,
    onChange,
    ButtonComponent = TabButton,
    selectionFollowsFocus,
    ...other
  } = props

  const label = labelProp || children

  const ownerState: TabOwnerState = {
    icon: !!iconProp,
    fullWidth,
    classes: classesProp,
    disabled,
    selected,
    label: !!label,
    iconPosition
  }

  const classes = useTabClasses(ownerState)

  const icon =
    iconProp && label && React.isValidElement(iconProp)
      ? React.cloneElement(iconProp, {
          className: clsx(classes.iconWrapper, iconProp.props.className)
        })
      : iconProp

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!selected && onChange) {
      onChange(value, event)
    }

    if (onClick) {
      onClick(event)
    }
  }

  const handleFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
    if (selectionFollowsFocus && !selected && onChange) {
      onChange(value, event)
    }

    if (onFocus) {
      onFocus(event)
    }
  }

  return (
    <ButtonComponent
      {...other}
      ref={ref}
      role="tab"
      disabled={disabled}
      aria-selected={selected}
      onFocus={handleFocus}
      onClick={handleClick}
      tabIndex={selected ? 0 : -1}
      className={clsx(classes.root, className)}
    >
      {iconPosition === 'top' || iconPosition === 'start' ? (
        <React.Fragment>
          {icon}
          {label}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {label}
          {icon}
        </React.Fragment>
      )}
      {indicator}
    </ButtonComponent>
  )
})

export default Tab
