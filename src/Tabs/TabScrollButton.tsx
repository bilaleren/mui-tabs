import * as React from 'react'
import clsx from 'clsx'
import TabButton, { TabButtonProps } from '../TabButton'

export interface TabScrollButtonProps extends TabButtonProps {
  direction: 'left' | 'right'
  orientation?: 'vertical' | 'horizontal'
  ButtonComponent?: React.ComponentType<TabButtonProps>
}

const ChevronLeft: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
  >
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
)

const ChevronRight: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
  >
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
)

const TabScrollButton = React.forwardRef<
  HTMLButtonElement,
  TabScrollButtonProps
>((props, ref) => {
  const {
    direction,
    disabled,
    className,
    orientation = 'horizontal',
    ButtonComponent = TabButton,
    ...other
  } = props

  const vertical = orientation === 'vertical'

  return (
    <ButtonComponent
      {...other}
      ref={ref}
      className={clsx(
        className,
        disabled && 'tabs-scroll-buttons-disabled',
        vertical && 'tabs-scroll-buttons-vertical',
        `tabs-scroll-buttons-${direction}`
      )}
      disabled={disabled}
    >
      {direction === 'left' ? <ChevronLeft /> : <ChevronRight />}
    </ButtonComponent>
  )
})

export default TabScrollButton
