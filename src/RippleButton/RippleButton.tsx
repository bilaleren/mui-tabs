import * as React from 'react'
import TouchRipple, {
  TouchRippleProps,
  TouchRippleRefAttributes
} from './TouchRipple'
import clsx from 'clsx'
import useForkRef from '../utils/useForkRef'
import useEventCallback from '../utils/useEventCallback'
import TabButton, { TabButtonProps } from '../TabButton'
import useIsFocusVisible from '../utils/useIsFocusVisible'

export interface RippleButtonActionRefAttributes {
  focusVisible: () => void
}

export interface RippleButtonProps extends TabButtonProps {
  action?: React.Ref<RippleButtonActionRefAttributes>
  focusRipple?: boolean
  centerRipple?: boolean
  disableRipple?: boolean
  disableTouchRipple?: boolean
  onFocusVisible?: React.FocusEventHandler<HTMLButtonElement>
  focusVisibleClassName?: string
  TouchRippleProps?: Partial<TouchRippleProps>
  touchRippleRef?: React.Ref<TouchRippleRefAttributes>
}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  (props, ref) => {
    const {
      action,
      children,
      touchRippleRef,
      disabled = false,
      disableRipple = false,
      focusRipple = false,
      centerRipple = false,
      disableTouchRipple = false,
      onBlur,
      onFocus,
      onFocusVisible,
      onMouseUp,
      onMouseDown,
      onDragLeave,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onClick,
      onKeyUp,
      onKeyDown,
      onContextMenu,
      onMouseLeave,
      tabIndex = 0,
      className,
      TouchRippleProps,
      focusVisibleClassName,
      ...other
    } = props

    const buttonRef = React.useRef<HTMLButtonElement | null>(null)

    const rippleRef = React.useRef<TouchRippleRefAttributes | null>(null)
    const handleRippleRef = useForkRef(rippleRef, touchRippleRef)

    const {
      isFocusVisibleRef,
      onFocus: handleFocusVisible,
      onBlur: handleBlurVisible,
      ref: focusVisibleRef
    } = useIsFocusVisible()

    const [focusVisible, setFocusVisible] = React.useState(false)

    if (disabled && focusVisible) {
      setFocusVisible(false)
    }

    React.useImperativeHandle(
      action,
      () => ({
        focusVisible: () => {
          if (buttonRef.current) {
            setFocusVisible(true)
            buttonRef.current.focus()
          }
        }
      }),
      []
    )

    const [mountedState, setMountedState] = React.useState(false)

    React.useEffect(() => {
      setMountedState(true)
    }, [])

    const enableTouchRipple = mountedState && !disableRipple && !disabled

    React.useEffect(() => {
      if (
        focusVisible &&
        focusRipple &&
        !disableRipple &&
        mountedState &&
        rippleRef.current
      ) {
        rippleRef.current.pulsate()
      }
    }, [disableRipple, focusRipple, focusVisible, mountedState])

    function useRippleHandler(
      rippleAction: keyof TouchRippleRefAttributes,
      eventCallback:
        | React.TouchEventHandler<HTMLButtonElement>
        | React.MouseEventHandler<HTMLButtonElement>
        | undefined,
      skipRippleAction = disableTouchRipple
    ) {
      return useEventCallback((event: any) => {
        if (eventCallback) {
          eventCallback(event)
        }

        if (!skipRippleAction && rippleRef.current) {
          rippleRef.current[rippleAction](event)
        }

        return true
      })
    }

    const handleMouseDown = useRippleHandler('start', onMouseDown)
    const handleContextMenu = useRippleHandler('stop', onContextMenu)
    const handleDragLeave = useRippleHandler('stop', onDragLeave)
    const handleMouseUp = useRippleHandler('stop', onMouseUp)
    const handleMouseLeave = useRippleHandler('stop', (event: any) => {
      if (focusVisible) {
        event.preventDefault()
      }
      if (onMouseLeave) {
        onMouseLeave(event)
      }
    })
    const handleTouchStart = useRippleHandler('start', onTouchStart)
    const handleTouchEnd = useRippleHandler('stop', onTouchEnd)
    const handleTouchMove = useRippleHandler('stop', onTouchMove)

    const handleBlur = useRippleHandler(
      'stop',
      (event: any) => {
        handleBlurVisible(event)

        if (!isFocusVisibleRef.current) {
          setFocusVisible(false)
        }

        if (onBlur) {
          onBlur(event)
        }
      },
      false
    )

    const handleFocus = useEventCallback(
      (event: React.FocusEvent<HTMLButtonElement>) => {
        // Fix for https://github.com/facebook/react/issues/7769
        if (!buttonRef.current) {
          buttonRef.current = event.currentTarget
        }

        handleFocusVisible(event)

        if (isFocusVisibleRef.current) {
          setFocusVisible(true)

          if (onFocusVisible) {
            onFocusVisible(event)
          }
        }

        if (onFocus) {
          onFocus(event)
        }
      }
    )

    const keydownRef = React.useRef(false)

    const handleKeyDown = useEventCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        // Check if key is already down to avoid repeats being counted as multiple activations
        if (
          focusRipple &&
          !keydownRef.current &&
          focusVisible &&
          rippleRef.current &&
          event.key === ' '
        ) {
          keydownRef.current = true
          rippleRef.current.stop(event, () => {
            rippleRef.current!.start(event)
          })
        }

        if (event.target === event.currentTarget && event.key === ' ') {
          event.preventDefault()
        }

        if (onKeyDown) {
          onKeyDown(event)
        }

        // Keyboard accessibility for non interactive elements
        if (
          event.target === event.currentTarget &&
          event.key === 'Enter' &&
          !disabled
        ) {
          event.preventDefault()

          if (onClick) {
            onClick(event as unknown as React.MouseEvent<HTMLButtonElement>)
          }
        }
      }
    )

    const handleKeyUp = useEventCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        // calling preventDefault in keyUp on a <button> will not dispatch a click event if Space is pressed
        // https://codesandbox.io/s/button-keyup-preventdefault-dn7f0
        if (
          focusRipple &&
          event.key === ' ' &&
          rippleRef.current &&
          focusVisible &&
          !event.defaultPrevented
        ) {
          keydownRef.current = false
          rippleRef.current.stop(event, () => {
            rippleRef.current!.pulsate()
          })
        }
        if (onKeyUp) {
          onKeyUp(event)
        }

        // Keyboard accessibility for non interactive elements
        if (
          onClick &&
          event.target === event.currentTarget &&
          event.key === ' ' &&
          !event.defaultPrevented
        ) {
          onClick(event as unknown as React.MouseEvent<HTMLButtonElement>)
        }
      }
    )

    const handleOwnRef = useForkRef(focusVisibleRef, buttonRef)
    const handleRef = useForkRef(ref, handleOwnRef)

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      React.useEffect(() => {
        if (enableTouchRipple && !rippleRef.current) {
          console.error(
            [
              'The `component` prop provided to RippleButton is invalid.',
              'Please make sure the children prop is rendered in this custom component.'
            ].join('\n')
          )
        }
      }, [enableTouchRipple])
    }

    return (
      <TabButton
        {...other}
        ref={handleRef}
        disabled={disabled}
        className={clsx(focusVisible && focusVisibleClassName, className)}
        onBlur={handleBlur}
        onClick={onClick}
        onContextMenu={handleContextMenu}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onDragLeave={handleDragLeave}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        tabIndex={disabled ? -1 : tabIndex}
      >
        {children}
        {enableTouchRipple && (
          <TouchRipple
            {...TouchRippleProps}
            ref={handleRippleRef}
            center={centerRipple}
          />
        )}
      </TabButton>
    )
  }
)

export default RippleButton
