import * as React from 'react'
import clsx from 'clsx'
import type { TouchRippleClasses } from './touchRippleClasses'

export interface RippleProps {
  in?: boolean
  classes: Omit<TouchRippleClasses, 'root'>
  pulsate?: boolean
  rippleX?: number
  rippleY?: number
  timeout?: number
  onExited?: () => void
  className?: string
  rippleSize?: number
}

const Ripple: React.FC<RippleProps> = (props: RippleProps) => {
  const {
    className,
    classes,
    pulsate = false,
    rippleX = 0,
    rippleY = 0,
    rippleSize = 0,
    in: inProp,
    onExited,
    timeout
  } = props

  const [leaving, setLeaving] = React.useState(false)

  const rippleClassName = clsx(
    className,
    classes.ripple,
    classes.rippleVisible,
    {
      [classes.ripplePulsate]: pulsate
    }
  )

  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX
  }

  const childClassName = clsx(classes.child, {
    [classes.childLeaving]: leaving,
    [classes.childPulsate]: pulsate
  })

  if (!inProp && !leaving) {
    setLeaving(true)
  }

  React.useEffect(() => {
    if (!inProp && onExited != null) {
      // react-transition-group#onExited
      const timeoutId = setTimeout(onExited, timeout)
      return () => {
        clearTimeout(timeoutId)
      }
    }
    return undefined
  }, [onExited, inProp, timeout])

  return (
    <span className={rippleClassName} style={rippleStyles}>
      <span className={childClassName} />
    </span>
  )
}

export default Ripple
