import * as React from 'react'
import clsx from 'clsx'
import TabButton, { TabButtonProps } from '../TabButton'

export interface TabScrollButtonProps extends TabButtonProps {
  direction: 'left' | 'right'
  orientation?: 'vertical' | 'horizontal'
  ButtonComponent?: React.ComponentType<TabButtonProps>
}

const Icon: React.FC<React.SVGAttributes<SVGSVGElement>> = (props) => {
  const { children, ...other } = props

  return (
    <svg
      fill="currentColor"
      stroke="currentColor"
      width={16}
      height={16}
      strokeWidth={1}
      {...other}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  )
}

const ChevronLeft: React.FC = () => (
  <Icon>
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </Icon>
)

const ChevronRight: React.FC = () => (
  <Icon>
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </Icon>
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
  const IconComponent = direction === 'left' ? ChevronLeft : ChevronRight

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
      <IconComponent />
    </ButtonComponent>
  )
})

export default TabScrollButton
