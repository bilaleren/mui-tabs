export interface TouchRippleClasses {
  root: string
  child: string
  ripple: string
  rippleVisible: string
  ripplePulsate: string
  childLeaving: string
  childPulsate: string
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
