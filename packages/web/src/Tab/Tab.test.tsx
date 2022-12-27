import * as React from 'react'
import Tab from './Tab'
import { spy } from 'sinon'
import { expect } from 'chai'
import tabClasses from './tabClasses'
import { createRenderer } from '../test/utils'

describe('<Tab />', () => {
  const { render } = createRenderer()

  describe('prop: selected', () => {
    it('should render with the selected classes', () => {
      const { getByRole } = render(<Tab selected />)

      const tab = getByRole('tab')
      expect(tab).to.have.class(tabClasses.root)
      expect(tab).to.have.class(tabClasses.selected)
      expect(tab).to.have.attribute('aria-selected', 'true')
    })
  })

  describe('prop: disabled', () => {
    it('should render with the disabled and root classes', () => {
      const { getByRole } = render(<Tab disabled />)

      const tab = getByRole('tab')
      expect(tab).to.have.class(tabClasses.root)
      expect(tab).to.have.class(tabClasses.disabled)
    })
  })

  describe('prop: onClick', () => {
    it('should be called when a click is triggered', () => {
      const handleClick = spy()
      const { getByRole } = render(<Tab onClick={handleClick} />)

      getByRole('tab').click()

      expect(handleClick.callCount).to.equal(1)
    })
  })

  describe('prop: label', () => {
    it('should render label', () => {
      const { getByRole } = render(<Tab label="foo" />)

      expect(getByRole('tab')).to.have.text('foo')
    })
  })

  describe('prop: icon', () => {
    it('should render icon element', () => {
      const { getByTestId } = render(<Tab icon={<div data-testid="icon" />} />)

      expect(getByTestId('icon')).not.to.null
    })

    it('should add a classname when passed together with label', () => {
      const { getByRole } = render(
        <Tab icon={<div className="test-icon" />} label="foo" />
      )
      const wrapper = getByRole('tab').children[0]
      expect(wrapper).to.have.class(tabClasses.iconWrapper)
      expect(wrapper).to.have.class('test-icon')
    })
  })

  describe('prop: fullWidth', () => {
    it('should have the fullWidth class', () => {
      const { getByRole } = render(<Tab fullWidth />)

      expect(getByRole('tab')).to.have.class(tabClasses.fullWidth)
    })
  })

  describe('prop: style', () => {
    it('should be able to override everything', () => {
      const { getByRole } = render(
        <Tab
          fullWidth
          style={{ width: '80%', color: 'red', textAlign: 'center' }}
        />
      )

      const { style } = getByRole('tab')
      expect(style).to.have.property('width', '80%')
      expect(style).to.have.property('color', 'red')
      expect(style).to.have.property('textAlign', 'center')
    })
  })
})
