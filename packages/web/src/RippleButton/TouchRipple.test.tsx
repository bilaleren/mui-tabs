import * as React from 'react'
import TouchRipple, {
  DELAY_RIPPLE,
  TouchRippleProps,
  TouchRippleRefAttributes
} from './TouchRipple'
import { expect } from 'chai'
import { act } from '@testing-library/react'
import { createRenderer } from '../test/utils'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

describe('<TouchRipple />', () => {
  const { clock, render } = createRenderer()

  function createTouchRippleRenderer(props?: TouchRippleProps) {
    const touchRippleRef = React.createRef<TouchRippleRefAttributes>()

    const { container, unmount } = render(
      <TouchRipple
        {...props}
        ref={touchRippleRef}
        classes={{
          child: 'child',
          ripple: 'ripple',
          childLeaving: 'child-leaving',
          rippleVisible: 'ripple-visible',
          ...props?.classes
        }}
      />
    )

    return {
      instance: touchRippleRef.current,
      unmount,
      queryRipple() {
        return container.querySelector<HTMLElement>('.ripple')
      },
      queryAllActiveRipples() {
        return container.querySelectorAll(
          '.ripple-visible .child:not(.child-leaving)'
        )
      },
      queryAllStoppingRipples() {
        return container.querySelectorAll('.ripple-visible .child-leaving')
      }
    }
  }

  describe('prop: center', () => {
    it('should compute the right ripple dimensions', () => {
      const { instance, queryRipple } = createTouchRippleRenderer({
        center: true
      })

      act(() => {
        instance!.start(
          {},
          {
            callback: noop,
            fakeElement: true
          }
        )
      })

      expect(queryRipple()!.style).to.have.property('width', '1px')
      expect(queryRipple()!.style).to.have.property('height', '1px')
    })
  })

  it('should create individual ripples', () => {
    const { instance, queryAllActiveRipples, queryAllStoppingRipples } =
      createTouchRippleRenderer()

    expect(queryAllActiveRipples()).to.have.lengthOf(0)
    expect(queryAllStoppingRipples()).to.have.lengthOf(0)

    act(() => {
      instance!.start({ clientX: 0, clientY: 0 }, { callback: noop })
    })

    expect(queryAllActiveRipples()).to.have.lengthOf(1)
    expect(queryAllStoppingRipples()).to.have.lengthOf(0)

    act(() => {
      instance!.start({ clientX: 0, clientY: 0 }, { callback: noop })
    })

    expect(queryAllActiveRipples()).to.have.lengthOf(2)
    expect(queryAllStoppingRipples()).to.have.lengthOf(0)

    act(() => {
      instance!.start({ clientX: 0, clientY: 0 }, { callback: noop })
    })

    expect(queryAllActiveRipples()).to.have.lengthOf(3)
    expect(queryAllStoppingRipples()).to.have.lengthOf(0)

    act(() => {
      instance!.stop({ type: 'mouseup' })
    })

    expect(queryAllActiveRipples()).to.have.lengthOf(2)
    expect(queryAllStoppingRipples()).to.have.lengthOf(1)

    act(() => {
      instance!.stop({ type: 'mouseup' })
    })

    expect(queryAllActiveRipples()).to.have.lengthOf(1)
    expect(queryAllStoppingRipples()).to.have.lengthOf(2)

    act(() => {
      instance!.stop({ type: 'mouseup' })
    })

    expect(queryAllActiveRipples()).to.have.lengthOf(0)
    expect(queryAllStoppingRipples()).to.have.lengthOf(3)
  })

  describe('creating unique ripples', () => {
    it('should create a ripple', () => {
      const { instance, queryAllActiveRipples, queryAllStoppingRipples } =
        createTouchRippleRenderer()

      act(() => {
        instance!.start(
          {},
          {
            pulsate: true,
            fakeElement: true,
            callback: noop
          }
        )
      })

      expect(queryAllActiveRipples()).to.have.lengthOf(1)
      expect(queryAllStoppingRipples()).to.have.lengthOf(0)
    })

    it('should ignore a mousedown event after a touchstart event', () => {
      const { instance, queryAllActiveRipples, queryAllStoppingRipples } =
        createTouchRippleRenderer()

      act(() => {
        instance!.start({ type: 'touchstart' }, { callback: noop })
        instance!.start({ type: 'mousedown' }, { callback: noop })
      })

      expect(queryAllActiveRipples()).to.have.lengthOf(1)
      expect(queryAllStoppingRipples()).to.have.lengthOf(0)
    })

    it('should create a specific ripple', () => {
      const {
        instance,
        queryAllActiveRipples,
        queryAllStoppingRipples,
        queryRipple
      } = createTouchRippleRenderer({
        center: true
      })
      const clientX = 1
      const clientY = 1

      act(() => {
        instance!.start(
          { clientX, clientY },
          { fakeElement: true, callback: noop }
        )
      })

      expect(queryAllActiveRipples()).to.have.lengthOf(1)
      expect(queryAllStoppingRipples()).to.have.lengthOf(0)
      expect(queryRipple()!.style).to.have.property('top', '-0.5px')
      expect(queryRipple()!.style).to.have.property('left', '-0.5px')
    })
  })

  describe('mobile', () => {
    clock.withFakeTimers()

    it('should delay the display of the ripples', () => {
      const { instance, queryAllActiveRipples, queryAllStoppingRipples } =
        createTouchRippleRenderer()

      expect(queryAllActiveRipples()).to.have.lengthOf(0)
      expect(queryAllStoppingRipples()).to.have.lengthOf(0)

      act(() => {
        instance!.start(
          { touches: [], clientX: 0, clientY: 0 },
          { fakeElement: true, callback: noop }
        )
      })

      expect(queryAllActiveRipples()).to.have.lengthOf(0)
      expect(queryAllStoppingRipples()).to.have.lengthOf(0)

      clock.tick(DELAY_RIPPLE)

      expect(queryAllActiveRipples()).to.have.lengthOf(1)
      expect(queryAllStoppingRipples()).to.have.lengthOf(0)

      clock.tick(DELAY_RIPPLE)

      act(() => {
        instance!.stop({ type: 'touchend' }, noop)
      })

      expect(queryAllActiveRipples()).to.have.lengthOf(0)
      expect(queryAllStoppingRipples()).to.have.lengthOf(1)
    })

    it('should trigger the ripple for short touch interactions', () => {
      const { instance, queryAllActiveRipples, queryAllStoppingRipples } =
        createTouchRippleRenderer()

      expect(queryAllActiveRipples()).to.have.lengthOf(0)
      expect(queryAllStoppingRipples()).to.have.lengthOf(0)

      act(() => {
        instance!.start(
          { touches: [], clientX: 0, clientY: 0 },
          { fakeElement: true, callback: noop }
        )
      })

      expect(queryAllActiveRipples()).to.have.lengthOf(0)
      expect(queryAllStoppingRipples()).to.have.lengthOf(0)

      clock.tick(DELAY_RIPPLE / 2)

      expect(queryAllActiveRipples()).to.have.lengthOf(0)
      expect(queryAllStoppingRipples()).to.have.lengthOf(0)

      act(() => {
        instance!.stop({ type: 'touchend' }, noop)
      })

      expect(queryAllActiveRipples()).to.have.lengthOf(1)
      expect(queryAllStoppingRipples()).to.have.lengthOf(0)

      clock.tick(1)

      expect(queryAllActiveRipples()).to.have.lengthOf(0)
      expect(queryAllStoppingRipples()).to.have.lengthOf(1)
    })

    it('should interrupt the ripple schedule', () => {
      const { instance, queryAllActiveRipples, queryAllStoppingRipples } =
        createTouchRippleRenderer()

      expect(queryAllActiveRipples()).to.have.lengthOf(0)
      expect(queryAllStoppingRipples()).to.have.lengthOf(0)

      instance!.start(
        { touches: [], clientX: 0, clientY: 0 },
        { fakeElement: true, callback: noop }
      )
      expect(queryAllActiveRipples()).to.have.lengthOf(0)
      expect(queryAllStoppingRipples()).to.have.lengthOf(0)

      clock.tick(DELAY_RIPPLE / 2)
      expect(queryAllActiveRipples()).to.have.lengthOf(0)
      expect(queryAllStoppingRipples()).to.have.lengthOf(0)

      instance!.stop({ type: 'touchmove' })
      clock.tick(DELAY_RIPPLE)
      expect(queryAllActiveRipples()).to.have.lengthOf(0)
      expect(queryAllStoppingRipples()).to.have.lengthOf(0)
    })

    it('should not leak on multi-touch', function () {
      const { instance, unmount } = createTouchRippleRenderer()

      instance!.start({ type: 'touchstart', touches: [{}] }, { callback: noop })
      instance!.start({ type: 'touchstart', touches: [{}] }, { callback: noop })
      unmount()

      // expect this to run gracefully without
      // "react state update on an unmounted component"
      clock.runAll()
    })
  })
})
