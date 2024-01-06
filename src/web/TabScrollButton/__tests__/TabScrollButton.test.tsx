import * as React from 'react'
import clsx from 'clsx'
import TabScrollButton from '../TabScrollButton'
import { createRenderer } from 'test-utils'
import { fireEvent } from '@testing-library/dom'
import tabScrollButtonClasses from '../tabScrollButtonClasses'

describe('<TabScrollButton />', () => {
  const { render } = createRenderer()

  describe('events', () => {
    it('should be called mouse events', () => {
      const handleClick = sinon.spy()
      const handleMouseUp = sinon.spy()
      const handleMouseDown = sinon.spy()

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

  describe('prop: direction', () => {
    it('should render with the direction classes', () => {
      const { container, setProps } = render(
        <TabScrollButton direction="left" />
      )

      const button = container.querySelector('.tab-button')

      expect(button).to.have.class(clsx(tabScrollButtonClasses.left))
      expect(button).not.have.class(clsx(tabScrollButtonClasses.right))

      setProps({
        direction: 'right'
      })

      expect(button).to.have.class(clsx(tabScrollButtonClasses.right))
      expect(button).not.have.class(clsx(tabScrollButtonClasses.left))
    })
  })

  describe('prop: orientation', () => {
    it('should render with the orientation classes', () => {
      const { container, setProps } = render(
        <TabScrollButton direction="left" orientation="vertical" />
      )

      const button = container.querySelector('.tab-button')

      expect(button).to.have.class(clsx(tabScrollButtonClasses.vertical))

      setProps({
        orientation: 'horizontal'
      })

      expect(button).not.have.class(clsx(tabScrollButtonClasses.vertical))
    })
  })

  describe('prop: hideMobile', () => {
    it('should render with the hideMobile classes', () => {
      const { container, setProps } = render(
        <TabScrollButton direction="left" hideMobile={true} />
      )

      const button = container.querySelector('.tab-button')

      expect(button).to.have.class(clsx(tabScrollButtonClasses.hideMobile))

      setProps({
        hideMobile: false
      })

      expect(button).not.have.class(clsx(tabScrollButtonClasses.hideMobile))
    })
  })

  describe('prop: disabled', () => {
    it('should render with the disabled and tab classes', () => {
      const { container } = render(
        <TabScrollButton direction="left" disabled={true} />
      )

      const button = container.querySelector('.tab-button')

      expect(button).to.have.class(clsx(tabScrollButtonClasses.disabled))
    })
  })
})
