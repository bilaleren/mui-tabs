import * as React from 'react'
import clsx from 'clsx'
import Ripple, { RippleProps } from './Ripple'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import touchRippleClasses, { TouchRippleClasses } from './touchRippleClasses'

const RIPPLE_TIMEOUT = 550
export const DELAY_RIPPLE = 80

type Noop = () => void

export type StartFn = (
  event: any,
  options?: {
    pulsate?: boolean
    center?: boolean
    fakeElement?: null | boolean | HTMLElement
    callback?: Noop
  }
) => void

export type StopFn = (event: any, callback?: Noop) => void

export type PulsateFn = Noop

export type StartCommitFn = (
  params: Omit<RippleProps, 'classes' | 'className'> & { callback?: Noop }
) => void

export interface TouchRippleProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  center?: boolean
  classes?: Partial<TouchRippleClasses>
  className?: string
}

export interface TouchRippleRefAttributes {
  stop: StopFn
  start: StartFn
  pulsate: PulsateFn
}

const TouchRipple = React.forwardRef<
  TouchRippleRefAttributes,
  TouchRippleProps
>((props, ref) => {
  const {
    center: centerProp = false,
    className,
    classes = {},
    ...other
  } = props

  const [ripples, setRipples] = React.useState<React.ReactNode[]>([])
  const nextKey = React.useRef(0)
  const rippleCallback = React.useRef<Noop | null | undefined>(null)

  React.useEffect(() => {
    if (rippleCallback.current) {
      rippleCallback.current()
      rippleCallback.current = null
    }
  }, [ripples])

  // Used to filter out mouse emulated events on mobile.
  const ignoringMouseDown = React.useRef(false)
  // We use a timer in order to only show the ripples for touch "click" like events.
  // We don't want to display the ripple for touch scroll events.
  const startTimer = React.useRef<number | null>(null)

  // This is the hook called once the previous timeout is ready.
  const startTimerCommit = React.useRef<Noop | null>(null)
  const container = React.useRef<HTMLSpanElement | null>(null)

  React.useEffect(() => {
    return () => {
      if (startTimer.current) {
        clearTimeout(startTimer.current)
      }
    }
  }, [])

  const startCommit = React.useCallback<StartCommitFn>(
    (params) => {
      const { pulsate, rippleX, rippleY, rippleSize, callback } = params

      setRipples((oldRipples) => [
        ...oldRipples,
        <Ripple
          key={nextKey.current}
          classes={{
            ripple: [classes.ripple, touchRippleClasses.ripple],
            rippleVisible: [
              classes.rippleVisible,
              touchRippleClasses.rippleVisible
            ],
            ripplePulsate: [
              classes.ripplePulsate,
              touchRippleClasses.ripplePulsate
            ],
            child: [classes.child, touchRippleClasses.child],
            childLeaving: [
              classes.childLeaving,
              touchRippleClasses.childLeaving
            ],
            childPulsate: [
              classes.childPulsate,
              touchRippleClasses.childPulsate
            ]
          }}
          timeout={RIPPLE_TIMEOUT}
          pulsate={pulsate}
          rippleX={rippleX}
          rippleY={rippleY}
          rippleSize={rippleSize}
        />
      ])
      nextKey.current += 1
      rippleCallback.current = callback
    },
    [classes]
  )

  const start = React.useCallback<StartFn>(
    (event = {}, options = {}) => {
      const {
        pulsate = false,
        center = centerProp || options.pulsate,
        fakeElement = null // For test purposes
      } = options

      if (event.type === 'mousedown' && ignoringMouseDown.current) {
        ignoringMouseDown.current = false
        return
      }

      if (event.type === 'touchstart') {
        ignoringMouseDown.current = true
      }

      const element = fakeElement ? null : container.current
      const rect = element
        ? element.getBoundingClientRect()
        : {
            width: 0,
            height: 0,
            left: 0,
            top: 0
          }

      // Get the size of the ripple
      let rippleX: number
      let rippleY: number
      let rippleSize: number

      if (
        center ||
        (event.clientX === 0 && event.clientY === 0) ||
        (!event.clientX && !event.touches)
      ) {
        rippleX = Math.round(rect.width / 2)
        rippleY = Math.round(rect.height / 2)
      } else {
        const { clientX, clientY } = event.touches ? event.touches[0] : event
        rippleX = Math.round(clientX - rect.left)
        rippleY = Math.round(clientY - rect.top)
      }

      if (center) {
        rippleSize = Math.sqrt((2 * rect.width ** 2 + rect.height ** 2) / 3)

        // For some reason the animation is broken on Mobile Chrome if the size is even.
        if (rippleSize % 2 === 0) {
          rippleSize += 1
        }
      } else {
        const sizeX =
          Math.max(
            Math.abs((element ? element.clientWidth : 0) - rippleX),
            rippleX
          ) *
            2 +
          2
        const sizeY =
          Math.max(
            Math.abs((element ? element.clientHeight : 0) - rippleY),
            rippleY
          ) *
            2 +
          2
        rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2)
      }

      // Touche devices
      if (event.touches) {
        // check that this isn't another touchstart due to multitouch
        // otherwise we will only clear a single timer when unmounting while two
        // are running
        if (startTimerCommit.current === null) {
          // Prepare the ripple effect.
          startTimerCommit.current = () => {
            startCommit({
              pulsate,
              rippleX,
              rippleY,
              rippleSize,
              callback: options.callback
            })
          }
          // Delay the execution of the ripple effect.
          startTimer.current = window.setTimeout(() => {
            if (startTimerCommit.current) {
              startTimerCommit.current()
              startTimerCommit.current = null
            }
          }, DELAY_RIPPLE) // We have to make a tradeoff with this value.
        }
      } else {
        startCommit({
          pulsate,
          rippleX,
          rippleY,
          rippleSize,
          callback: options.callback
        })
      }
    },
    [centerProp, startCommit]
  )

  const pulsate = React.useCallback<PulsateFn>(() => {
    start({}, { pulsate: true })
  }, [start])

  const stop = React.useCallback((event: any, callback: any) => {
    if (startTimer.current) {
      clearTimeout(startTimer.current)
    }

    // The touch interaction occurs too quickly.
    // We still want to show ripple effect.
    if (event.type === 'touchend' && startTimerCommit.current) {
      startTimerCommit.current()
      startTimerCommit.current = null
      startTimer.current = window.setTimeout(() => {
        stop(event, callback)
      })
      return
    }

    startTimerCommit.current = null

    setRipples((oldRipples) => {
      if (oldRipples.length > 0) {
        return oldRipples.slice(1)
      }
      return oldRipples
    })
    rippleCallback.current = callback
  }, [])

  React.useImperativeHandle(
    ref,
    () => ({
      pulsate,
      start,
      stop
    }),
    [pulsate, start, stop]
  )

  return (
    <span
      {...other}
      ref={container}
      className={clsx(touchRippleClasses.root, classes.root, className)}
    >
      <TransitionGroup component={null} exit>
        {ripples}
      </TransitionGroup>
    </span>
  )
})

export default TouchRipple
