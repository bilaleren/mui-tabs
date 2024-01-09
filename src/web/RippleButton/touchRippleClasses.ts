export interface TouchRippleClasses {
  readonly root: string
  readonly child: string
  readonly ripple: string
  readonly rippleVisible: string
  readonly ripplePulsate: string
  readonly childLeaving: string
  readonly childPulsate: string
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
