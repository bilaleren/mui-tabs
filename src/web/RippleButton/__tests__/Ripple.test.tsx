import * as React from 'react'
import Ripple from '../Ripple'
import { createRenderer } from 'test-utils'
import touchRippleClasses from '../touchRippleClasses'

describe('<Ripple />', () => {
  const { render, clock } = createRenderer()

  it('should have the ripple className', () => {
    const { container } = render(
      <Ripple
        classes={touchRippleClasses}
        timeout={0}
        rippleX={0}
        rippleY={0}
        rippleSize={11}
      />
    )
    const ripple = container.querySelector('span')
    expect(ripple).to.have.class(touchRippleClasses.ripple)
    expect(ripple).not.to.have.class('fast')
  })

  describe('starting and stopping', () => {
    it('should start the ripple', () => {
      const { container, setProps } = render(
        <Ripple
          classes={touchRippleClasses}
          timeout={0}
          rippleX={0}
          rippleY={0}
          rippleSize={11}
        />
      )

      setProps({ in: true })

      const ripple = container.querySelector('span')
      expect(ripple).to.have.class(touchRippleClasses.rippleVisible)
    })

    it('should stop the ripple', () => {
      const { container, setProps } = render(
        <Ripple
          classes={touchRippleClasses}
          in={true}
          timeout={0}
          rippleX={0}
          rippleY={0}
          rippleSize={11}
        />
      )

      setProps({ in: false })

      const child = container.querySelector('span > span')
      expect(child).to.have.class(touchRippleClasses.childLeaving)
    })
  })

  describe('pulsating and stopping 1', () => {
    it('should render the ripple inside a pulsating Ripple', () => {
      const { container } = render(
        <Ripple
          classes={touchRippleClasses}
          timeout={0}
          rippleX={0}
          rippleY={0}
          rippleSize={11}
          pulsate={true}
        />
      )

      const ripple = container.querySelector('span')
      expect(ripple).to.have.class(touchRippleClasses.ripple)
      expect(ripple).to.have.class(touchRippleClasses.ripplePulsate)
      const child = container.querySelector('span > span')
      expect(child).to.have.class(touchRippleClasses.childPulsate)
    })

    it('should start the ripple', () => {
      const { container, setProps } = render(
        <Ripple
          classes={touchRippleClasses}
          timeout={0}
          rippleX={0}
          rippleY={0}
          rippleSize={11}
          pulsate={true}
        />
      )

      setProps({ in: true })

      const ripple = container.querySelector('span')
      expect(ripple).to.have.class(touchRippleClasses.rippleVisible)
      const child = container.querySelector('span > span')
      expect(child).to.have.class(touchRippleClasses.childPulsate)
    })

    it('should stop the ripple', () => {
      const { container, setProps } = render(
        <Ripple
          classes={touchRippleClasses}
          timeout={0}
          rippleX={0}
          rippleY={0}
          rippleSize={11}
          pulsate={true}
        />
      )

      setProps({ in: true })
      setProps({ in: false })
      const child = container.querySelector('span > span')
      expect(child).to.have.class(touchRippleClasses.childLeaving)
    })
  })

  describe('pulsating and stopping 2', () => {
    clock.withFakeTimers()

    it('handleExit should trigger a timer', () => {
      const handleExited = sinon.spy()
      const { setProps } = render(
        <Ripple
          classes={touchRippleClasses}
          timeout={550}
          in
          onExited={handleExited}
          rippleX={0}
          rippleY={0}
          rippleSize={11}
          pulsate
        />
      )

      setProps({ in: false })

      clock.tick(549)

      expect(handleExited.callCount).to.equal(0)

      clock.tick(1)

      expect(handleExited.callCount).to.equal(1)
    })

    it('unmount should defuse the handleExit timer', () => {
      const handleExited = sinon.spy()
      const { setProps, unmount } = render(
        <Ripple
          classes={touchRippleClasses}
          timeout={550}
          in
          onExited={handleExited}
          rippleX={0}
          rippleY={0}
          rippleSize={11}
          pulsate
        />
      )

      setProps({ in: false })

      unmount()

      clock.tick(550)

      expect(handleExited.callCount).to.equal(0)
    })
  })
})
