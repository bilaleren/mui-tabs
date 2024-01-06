import type { ClassValue } from 'clsx'

export interface TouchRippleClasses {
  root: ClassValue
  child: ClassValue
  ripple: ClassValue
  rippleVisible: ClassValue
  ripplePulsate: ClassValue
  childLeaving: ClassValue
  childPulsate: ClassValue
}

const touchRippleClasses: TouchRippleClasses = {
  root: 'tab-touch-ripple-root',
  child: 'tab-touch-ripple-child',
  ripple: 'tab-touch-ripple-ripple',
  rippleVisible: 'tab-touch-ripple-visible',
  ripplePulsate: 'tab-touch-ripple-pulsate',
  childLeaving: 'tab-touch-ripple-child-leaving',
  childPulsate: 'tab-touch-ripple-child-pulsate'
}

export default touchRippleClasses
