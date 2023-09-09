import * as React from 'react'
import clsx from 'clsx'
import TabButton, { TabButtonProps } from '../TabButton'
import { useTabClasses, TabClasses, TabOwnerState } from './tabClasses'
import type { TabValue, IconPosition, ChangeHandler } from '../types'

type ButtonAttributes = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'disabled' | 'onChange'
>

export interface TabProps extends ButtonAttributes {
  /**
   * You can provide your own value. Otherwise, we fallback to the child position index.
   */
  value?: TabValue

  /**
   * The label element.
   */
  label?: React.ReactNode

  /**
   * The icon to display.
   */
  icon?: React.ReactNode

  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TabClasses>

  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled?: boolean

  /**
   * Indicates whether the tab is selected.
   * @default false
   */
  selected?: boolean

  /**
   * The position of the icon relative to the label.
   * @default 'top'
   */
  iconPosition?: IconPosition

  /**
   * Used to assign a custom indicator.
   */
  indicator?: React.ReactNode

  /**
   * @default false
   */
  fullWidth?: boolean

  /**
   * Callback fired when the value changes.
   */
  onChange?: ChangeHandler

  /**
   * If `true` the selected tab changes on focus. Otherwise it only
   * changes on activation.
   */
  selectionFollowsFocus?: boolean

  /**
   * The component used to render the tab.
   */
  ButtonComponent?: React.ComponentType<TabButtonProps>
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
    iconProp && React.isValidElement(iconProp)
      ? React.cloneElement(iconProp as React.ReactElement, {
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