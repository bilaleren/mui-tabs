import * as React from 'react'
import clsx from 'clsx'

export type TabButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const TabButton = React.forwardRef<HTMLButtonElement, TabButtonProps>(
  (props, ref) => {
    const { className, children, disabled, ...other } = props

    return (
      <button
        {...other}
        ref={ref}
        className={clsx(
          'tab-button',
          disabled && 'tab-button-disabled',
          className
        )}
        disabled={disabled}
      >
        {children}
      </button>
    )
  }
)

export default TabButton
