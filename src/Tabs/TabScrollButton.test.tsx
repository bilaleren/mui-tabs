import * as React from 'react'
import { spy } from 'sinon'
import { expect } from 'chai'
import TabScrollButton from './TabScrollButton'
import { createRenderer } from '../test/utils'
import { fireEvent } from '@testing-library/dom'

describe('<TabScrollButton />', () => {
  const { render } = createRenderer()

  describe('events', () => {
    it('should be called mouse events', () => {
      const handleClick = spy()
      const handleMouseUp = spy()
      const handleMouseDown = spy()

      const { container } = render(
        <TabScrollButton
          direction="left"
          onClick={handleClick}
          onMouseUp={handleMouseUp}
          onMouseDown={handleMouseDown}
        />
      )

      const button = container.querySelector('.tab-button')

      fireEvent.click(button!)
      fireEvent.mouseUp(button!)
      fireEvent.mouseDown(button!)

      expect(handleClick.callCount).to.equal(1)
      expect(handleMouseUp.callCount).to.equal(1)
      expect(handleMouseDown.callCount).to.equal(1)
    })
  })

  describe('prop: ref', () => {
    it('should be able to access ref', () => {
      const buttonRef = React.createRef<HTMLButtonElement>()

      render(<TabScrollButton direction="left" ref={buttonRef} />)

      expect(buttonRef.current).not.null
      expect(buttonRef.current!.nodeName).to.equal('BUTTON')
    })
  })

  describe('prop: direction', () => {
    it('should render with the direction classes', () => {
      const { container, setProps } = render(
        <TabScrollButton direction="left" />
      )

      const button = container.querySelector('.tab-button')

      expect(button).to.have.class('tabs-scroll-buttons-left')
      expect(button).not.have.class('tabs-scroll-buttons-right')

      setProps({
        direction: 'right'
      })

      expect(button).to.have.class('tabs-scroll-buttons-right')
      expect(button).not.have.class('tabs-scroll-buttons-left')
    })
  })

  describe('prop: orientation', () => {
    it('should render with the orientation classes', () => {
      const { container, setProps } = render(
        <TabScrollButton direction="left" orientation="vertical" />
      )

      const button = container.querySelector('.tab-button')

      expect(button).to.have.class('tabs-scroll-buttons-vertical')

      setProps({
        orientation: 'horizontal'
      })

      expect(button).not.have.class('tabs-scroll-buttons-vertical')
    })
  })

  describe('prop: disabled', () => {
    it('should render with the disabled and tab classes', () => {
      const { container } = render(
        <TabScrollButton direction="left" disabled />
      )

      const button = container.querySelector('.tab-button')

      expect(button).to.have.class('tabs-scroll-buttons-disabled')
    })
  })
})
