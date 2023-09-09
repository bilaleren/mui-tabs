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
