import * as React from 'react'
import { spy } from 'sinon'
import { expect } from 'chai'
import ScrollbarSize from './ScrollbarSize'
import { act } from '@testing-library/react'
import { createRenderer } from '../test/utils'

describe('<ScrollBarSize />', () => {
  const { clock, render } = createRenderer({ clock: 'fake' })

  describe('mount', () => {
    it('should call on initial load', () => {
      const onChange = spy()

      render(<ScrollbarSize onChange={onChange} />)

      expect(onChange.called).to.equal(true)
    })
  })

  describe('prop: onChange', () => {
    it('should call on first resize event', () => {
      const onChange = spy()
      const { container } = render(<ScrollbarSize onChange={onChange} />)

      Object.defineProperty(container.firstChild, 'offsetHeight', { value: 20 })
      Object.defineProperty(container.firstChild, 'clientHeight', { value: 0 })

      onChange.resetHistory()

      act(() => {
        window.dispatchEvent(new window.Event('resize', {}))
      })

      clock.tick(166)

      expect(onChange.callCount).to.equal(1)
      expect(onChange.args[0][0]).to.equal(20)
    })
  })
})
