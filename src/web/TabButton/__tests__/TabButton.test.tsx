import * as React from 'react'
import TabButton from '../TabButton'
import { createRenderer } from 'test-utils'
import { fireEvent } from '@testing-library/dom'

describe('<TabButton />', () => {
  const { render } = createRenderer()

  describe('events', () => {
    it('should be called mouse events', () => {
      const handleClick = sinon.spy()
      const handleMouseUp = sinon.spy()
      const handleMouseDown = sinon.spy()

      const { getByText } = render(
        <TabButton
          onClick={handleClick}
          onMouseUp={handleMouseUp}
          onMouseDown={handleMouseDown}
        >
          Hello
        </TabButton>
      )

      const button = getByText('Hello')

      fireEvent.click(button)
      fireEvent.mouseUp(button)
      fireEvent.mouseDown(button)

      expect(handleClick.callCount).to.equal(1)
      expect(handleMouseUp.callCount).to.equal(1)
      expect(handleMouseDown.callCount).to.equal(1)
    })
  })

  describe('prop: ref', () => {
    it('should be able to access ref', () => {
      const buttonRef = React.createRef<HTMLButtonElement>()

      render(<TabButton ref={buttonRef}>Hello</TabButton>)

      expect(buttonRef.current).not.null
      expect(buttonRef.current!.nodeName).to.equal('BUTTON')
    })
  })

  describe('prop: disabled', () => {
    it('should render with the disabled and tab classes', () => {
      const { getByText } = render(<TabButton disabled>Hello</TabButton>)

      const button = getByText('Hello')

      expect(button).to.have.class('tab-button')
      expect(button).to.have.class('tab-button-disabled')
    })
  })
})
