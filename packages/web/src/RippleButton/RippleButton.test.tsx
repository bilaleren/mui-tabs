import * as React from 'react'
import { spy } from 'sinon'
import { expect } from 'chai'
import { act } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
import {
  focusVisible,
  createRenderer,
  simulatePointerDevice
} from '../test/utils'
import type { TouchRippleRefAttributes } from './TouchRipple'
import RippleButton, { RippleButtonActionRefAttributes } from './RippleButton'

describe('<RippleButton />', () => {
  const { render } = createRenderer()

  let canFireDragEvents = true

  before(() => {
    // browser testing config
    try {
      const EventConstructor = window.DragEvent || window.Event
      // eslint-disable-next-line no-new
      new EventConstructor('')
    } catch (err) {
      canFireDragEvents = false
    }
  })

  describe('event callbacks', () => {
    it('should fire event callbacks', () => {
      const onClick = spy()
      const onBlur = spy()
      const onFocus = spy()
      const onKeyUp = spy()
      const onKeyDown = spy()
      const onMouseDown = spy()
      const onMouseUp = spy()
      const onContextMenu = spy()
      const onDragEnd = spy()
      const onTouchStart = spy()
      const onTouchEnd = spy()

      const { getByText } = render(
        <RippleButton
          onClick={onClick}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onContextMenu={onContextMenu}
          onDragEnd={onDragEnd}
          onTouchEnd={onTouchEnd}
          onTouchStart={onTouchStart}
        >
          Hello
        </RippleButton>
      )

      const button = getByText('Hello')

      // only run in supported browsers
      if (typeof Touch !== 'undefined') {
        // eslint-disable-next-line no-undef
        const touch = new Touch({
          identifier: 0,
          target: button,
          clientX: 0,
          clientY: 0
        })

        fireEvent.touchStart(button, { touches: [touch] })
        expect(onTouchStart.callCount).to.equal(1)

        fireEvent.touchEnd(button, { touches: [touch] })
        expect(onTouchEnd.callCount).to.equal(1)
      }

      if (canFireDragEvents) {
        fireEvent.dragEnd(button)
        expect(onDragEnd.callCount).to.equal(1)
      }

      fireEvent.mouseDown(button)
      expect(onMouseDown.callCount).to.equal(1)

      fireEvent.mouseUp(button)
      expect(onMouseUp.callCount).to.equal(1)

      fireEvent.contextMenu(button)
      expect(onContextMenu.callCount).to.equal(1)

      fireEvent.click(button)
      expect(onClick.callCount).to.equal(1)

      act(() => {
        button.focus()
      })

      expect(onFocus.callCount).to.equal(1)

      fireEvent.keyDown(button)
      expect(onKeyDown.callCount).to.equal(1)

      fireEvent.keyUp(button)
      expect(onKeyUp.callCount).to.equal(1)

      act(() => {
        button.blur()
      })

      expect(onBlur.callCount).to.equal(1)
    })
  })

  describe('ripple', () => {
    describe('interactions', () => {
      it('should not have a focus ripple by default', () => {
        const { getByRole } = render(
          <RippleButton
            TouchRippleProps={{
              classes: {
                ripplePulsate: 'ripple-pulsate'
              }
            }}
          />
        )
        const button = getByRole('button')

        simulatePointerDevice()

        focusVisible(button)

        expect(button.querySelectorAll('.ripple-pulsate')).to.have.lengthOf(0)
      })

      it('should start the ripple when the mouse is pressed', () => {
        const { getByRole } = render(
          <RippleButton
            TouchRippleProps={{
              classes: {
                child: 'child',
                rippleVisible: 'ripple-visible',
                childLeaving: 'child-leaving'
              }
            }}
          />
        )
        const button = getByRole('button')

        fireEvent.mouseDown(button)

        expect(
          button.querySelectorAll('.ripple-visible .child-leaving')
        ).to.have.lengthOf(0)

        expect(
          button.querySelectorAll('.ripple-visible .child:not(.child-leaving)')
        ).to.have.lengthOf(1)
      })

      it('should stop the ripple when the mouse is released', () => {
        const { getByRole } = render(
          <RippleButton
            TouchRippleProps={{
              classes: {
                rippleVisible: 'ripple-visible',
                child: 'child',
                childLeaving: 'child-leaving'
              }
            }}
          />
        )
        const button = getByRole('button')

        fireEvent.mouseDown(button)

        fireEvent.mouseUp(button)

        expect(
          button.querySelectorAll('.ripple-visible .child-leaving')
        ).to.have.lengthOf(1)

        expect(
          button.querySelectorAll('.ripple-visible .child:not(.child-leaving)')
        ).to.have.lengthOf(0)
      })

      it('should start the ripple when the mouse is pressed 2', () => {
        const { getByRole } = render(
          <RippleButton
            TouchRippleProps={{
              classes: {
                rippleVisible: 'ripple-visible',
                child: 'child',
                childLeaving: 'child-leaving'
              }
            }}
          />
        )
        const button = getByRole('button')

        fireEvent.mouseDown(button)
        fireEvent.mouseUp(button)

        fireEvent.mouseDown(button)

        expect(
          button.querySelectorAll('.ripple-visible .child-leaving')
        ).to.have.lengthOf(1)

        expect(
          button.querySelectorAll('.ripple-visible .child:not(.child-leaving)')
        ).to.have.lengthOf(1)
      })

      it('should stop the ripple when the button blurs', () => {
        const { getByRole } = render(
          <RippleButton
            TouchRippleProps={{
              classes: {
                rippleVisible: 'ripple-visible',
                child: 'child',
                childLeaving: 'child-leaving'
              }
            }}
          />
        )
        const button = getByRole('button')

        fireEvent.mouseDown(button)

        button.blur()

        expect(
          button.querySelectorAll('.ripple-visible .child-leaving')
        ).to.have.lengthOf(0)

        expect(
          button.querySelectorAll('.ripple-visible .child:not(.child-leaving)')
        ).to.have.lengthOf(1)
      })

      it('should restart the ripple when the mouse is pressed again', () => {
        const { getByRole } = render(
          <RippleButton
            TouchRippleProps={{
              classes: {
                rippleVisible: 'ripple-visible',
                child: 'child',
                childLeaving: 'child-leaving'
              }
            }}
          />
        )
        const button = getByRole('button')

        fireEvent.mouseDown(button)

        expect(
          button.querySelectorAll('.ripple-visible .child-leaving')
        ).to.have.lengthOf(0)

        expect(
          button.querySelectorAll('.ripple-visible .child:not(.child-leaving)')
        ).to.have.lengthOf(1)

        fireEvent.mouseUp(button)
        fireEvent.mouseDown(button)

        expect(
          button.querySelectorAll('.ripple-visible .child-leaving')
        ).to.have.lengthOf(1)

        expect(
          button.querySelectorAll('.ripple-visible .child:not(.child-leaving)')
        ).to.have.lengthOf(1)
      })

      it('should stop the ripple when the mouse up', () => {
        const { getByText } = render(
          <RippleButton
            TouchRippleProps={{
              classes: {
                child: 'child',
                rippleVisible: 'ripple-visible',
                childLeaving: 'child-leaving'
              }
            }}
          >
            Hello
          </RippleButton>
        )
        const button = getByText('Hello')

        fireEvent.mouseDown(button)
        fireEvent.mouseUp(button)

        expect(
          button.querySelectorAll('.ripple-visible .child-leaving')
        ).to.have.lengthOf(1)

        expect(
          button.querySelectorAll('.ripple-visible .child:not(.child-leaving)')
        ).to.have.lengthOf(0)
      })

      it('should stop the ripple when dragging has finished', function () {
        if (!canFireDragEvents) {
          this.skip()
        }

        const { getByRole } = render(
          <RippleButton
            TouchRippleProps={{
              classes: {
                rippleVisible: 'ripple-visible',
                child: 'child',
                childLeaving: 'child-leaving'
              }
            }}
          />
        )
        const button = getByRole('button')

        fireEvent.mouseDown(button)

        fireEvent.dragLeave(button)

        expect(
          button.querySelectorAll('.ripple-visible .child-leaving')
        ).to.have.lengthOf(1)

        expect(
          button.querySelectorAll('.ripple-visible .child:not(.child-leaving)')
        ).to.have.lengthOf(0)
      })

      it('should stop the ripple when the context menu opens', () => {
        const { getByText } = render(
          <RippleButton
            TouchRippleProps={{
              classes: {
                child: 'child',
                rippleVisible: 'ripple-visible',
                childLeaving: 'child-leaving'
              }
            }}
          >
            Hello
          </RippleButton>
        )
        const button = getByText('Hello')

        fireEvent.mouseDown(button)

        expect(
          button.querySelectorAll('.ripple-visible .child-leaving')
        ).to.have.lengthOf(0)

        expect(
          button.querySelectorAll('.ripple-visible .child:not(.child-leaving)')
        ).to.have.lengthOf(1)

        fireEvent.contextMenu(button)

        expect(
          button.querySelectorAll('.ripple-visible .child-leaving')
        ).to.have.lengthOf(1)

        expect(
          button.querySelectorAll('.ripple-visible .child:not(.child-leaving)')
        ).to.have.lengthOf(0)
      })

      it('should not crash when changes enableRipple from false to true', () => {
        function App() {
          const buttonRef =
            React.useRef<RippleButtonActionRefAttributes | null>(null)
          const [enableRipple, setRipple] = React.useState(false)

          React.useEffect(() => {
            if (buttonRef.current) {
              buttonRef.current.focusVisible()
            } else {
              throw new Error('buttonRef.current must be available')
            }
          }, [])

          return (
            <div>
              <button
                type="button"
                data-testid="trigger"
                onClick={() => {
                  setRipple(true)
                }}
              >
                Trigger crash
              </button>
              <RippleButton
                autoFocus
                action={buttonRef}
                TouchRippleProps={{
                  classes: {
                    ripplePulsate: 'ripple-pulsate'
                  }
                }}
                focusRipple
                disableRipple={!enableRipple}
              >
                the button
              </RippleButton>
            </div>
          )
        }

        const { container, getByTestId } = render(<App />)

        fireEvent.click(getByTestId('trigger'))
        expect(container.querySelectorAll('.ripple-pulsate')).to.have.lengthOf(
          1
        )
      })

      it('should stop the ripple on blur if disableTouchRipple is set', () => {
        const buttonActions = React.createRef<RippleButtonActionRefAttributes>()

        const { getByText } = render(
          <RippleButton
            action={buttonActions}
            focusRipple
            disableTouchRipple
            TouchRippleProps={{
              classes: {
                child: 'child',
                rippleVisible: 'ripple-visible',
                childLeaving: 'child-leaving'
              }
            }}
          >
            Hello
          </RippleButton>
        )

        const button = getByText('Hello')

        simulatePointerDevice()
        focusVisible(button)

        act(() => {
          button.blur()
        })

        expect(
          button.querySelectorAll('.ripple-visible .child-leaving')
        ).to.have.lengthOf(1)
      })
    })
  })

  describe('prop: centerRipple', () => {
    it('centers the TouchRipple', () => {
      const { container, getByText } = render(
        <RippleButton
          centerRipple
          TouchRippleProps={{
            classes: { root: 'touch-ripple', ripple: 'touch-ripple-ripple' }
          }}
        >
          Hello
        </RippleButton>
      )

      Object.defineProperty(
        container.querySelector('.touch-ripple'),
        'getBoundingClientRect',
        {
          value: () => ({
            width: 100,
            height: 100,
            bottom: 10,
            left: 20,
            top: 20
          })
        }
      )

      fireEvent.mouseDown(getByText('Hello'), { clientX: 10, clientY: 10 })

      const rippleRipple = container.querySelector('.touch-ripple-ripple')
      expect(rippleRipple).not.to.equal(null)

      const rippleStyle = window.getComputedStyle(rippleRipple!)
      expect(rippleStyle).to.have.property('height', '101px')
      expect(rippleStyle).to.have.property('width', '101px')
    })

    it('is disabled by default', () => {
      const { container, getByText } = render(
        <RippleButton
          TouchRippleProps={{
            classes: { root: 'touch-ripple', ripple: 'touch-ripple-ripple' }
          }}
        >
          Hello
        </RippleButton>
      )

      Object.defineProperty(
        container.querySelector('.touch-ripple'),
        'getBoundingClientRect',
        {
          value: () => ({
            width: 100,
            height: 100,
            bottom: 10,
            left: 20,
            top: 20
          })
        }
      )

      fireEvent.mouseDown(getByText('Hello'), { clientX: 10, clientY: 10 })

      const rippleRipple = container.querySelector('.touch-ripple-ripple')
      expect(rippleRipple).not.to.equal(null)

      const rippleStyle = window.getComputedStyle(rippleRipple!)
      expect(rippleStyle).not.to.have.property('height', '101px')
      expect(rippleStyle).not.to.have.property('width', '101px')
    })
  })

  describe('focusRipple', () => {
    it('should pulsate the ripple when focusVisible', () => {
      const { getByText } = render(
        <RippleButton
          focusRipple
          TouchRippleProps={{
            classes: {
              ripplePulsate: 'ripple-pulsate'
            }
          }}
        >
          Hello
        </RippleButton>
      )
      const button = getByText('Hello')

      simulatePointerDevice()
      focusVisible(button)

      expect(button.querySelectorAll('.ripple-pulsate')).to.have.lengthOf(1)
    })

    it('should not stop the ripple when the mouse leaves', () => {
      const { getByText } = render(
        <RippleButton
          focusRipple
          TouchRippleProps={{
            classes: {
              ripplePulsate: 'ripple-pulsate'
            }
          }}
        >
          Hello
        </RippleButton>
      )
      const button = getByText('Hello')

      simulatePointerDevice()
      focusVisible(button)

      fireEvent.mouseLeave(button)

      expect(button.querySelectorAll('.ripple-pulsate')).to.have.lengthOf(1)
    })

    it('should stop pulsate and start a ripple when the space button is pressed', () => {
      const { getByText } = render(
        <RippleButton
          focusRipple
          TouchRippleProps={{
            classes: {
              childLeaving: 'child-leaving',
              ripplePulsate: 'ripple-pulsate',
              rippleVisible: 'rippled-visible'
            }
          }}
        >
          Hello
        </RippleButton>
      )
      const button = getByText('Hello')

      simulatePointerDevice()
      focusVisible(button)

      fireEvent.keyDown(button, { key: ' ' })

      expect(
        button.querySelectorAll('.ripple-pulsate .child-leaving')
      ).to.have.lengthOf(1)
      expect(button.querySelectorAll('.ripple-visible')).to.have.lengthOf(0)
    })

    it('should stop and re-pulsate when space bar is released', () => {
      const { getByText } = render(
        <RippleButton
          focusRipple
          TouchRippleProps={{
            classes: {
              childLeaving: 'child-leaving',
              ripplePulsate: 'ripple-pulsate',
              rippleVisible: 'ripple-visible'
            }
          }}
        >
          Hello
        </RippleButton>
      )
      const button = getByText('Hello')

      simulatePointerDevice()
      focusVisible(button)

      fireEvent.keyDown(button, { key: ' ' })
      fireEvent.keyUp(button, { key: ' ' })

      expect(
        button.querySelectorAll('.ripple-pulsate .child-leaving')
      ).to.have.lengthOf(1)

      expect(button.querySelectorAll('.ripple-pulsate')).to.have.lengthOf(2)
      expect(button.querySelectorAll('.ripple-visible')).to.have.lengthOf(3)
    })

    it('should stop on blur and set focusVisible to false', () => {
      const { getByText } = render(
        <RippleButton
          focusRipple
          TouchRippleProps={{
            classes: {
              childLeaving: 'child-leaving',
              rippleVisible: 'ripple-visible'
            }
          }}
        >
          Hello
        </RippleButton>
      )
      const button = getByText('Hello')

      simulatePointerDevice()
      focusVisible(button)

      act(() => {
        button.blur()
      })

      expect(
        button.querySelectorAll('.ripple-visible .child-leaving')
      ).to.have.lengthOf(1)
    })
  })

  describe('prop: disabled', () => {
    it('should have a negative tabIndex', () => {
      const { getByText } = render(<RippleButton disabled>Hello</RippleButton>)
      expect(getByText('Hello')).to.have.property('tabIndex', -1)
    })

    it('should forward it to native buttons', () => {
      const { getByText } = render(<RippleButton disabled>Hello</RippleButton>)
      expect(getByText('Hello')).to.have.property('disabled', true)
    })

    it('should not use aria-disabled with button host', () => {
      const { getByText } = render(<RippleButton disabled>Hello</RippleButton>)
      const button = getByText('Hello')

      expect(button).to.have.attribute('disabled')
      expect(button).not.to.have.attribute('aria-disabled')
    })
  })

  describe('prop: touchRippleRef', () => {
    it('should return a ref', () => {
      const ref = React.createRef<TouchRippleRefAttributes>()

      render(<RippleButton touchRippleRef={ref} />)

      expect(ref.current).not.to.equal(null)
      expect(ref.current!.stop).to.be.a('function')
      expect(ref.current!.start).to.be.a('function')
      expect(ref.current!.pulsate).to.be.a('function')
    })
  })
})
