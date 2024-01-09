import * as React from 'react'
import Tab from '../../Tab'
import tabsClasses from '../tabsClasses'
import tabClasses from '../../Tab/tabClasses'
import { act } from '@testing-library/react'
import { createRenderer } from 'test-utils'
import { fireEvent } from '@testing-library/dom'
import Tabs, { TabsRefAttributes } from '../Tabs'
import tabScrollButtonClasses from '../../TabScrollButton/tabScrollButtonClasses'

function findScrollButton(
  container: HTMLElement,
  direction: 'left' | 'right'
): HTMLElement | null {
  return container.querySelector<HTMLElement>(
    `.${tabsClasses.root} > .${tabScrollButtonClasses[direction]}`
  )
}

function hasLeftScrollButton(container: HTMLElement): boolean {
  const button = findScrollButton(container, 'left')
  return !!(
    button && !button.classList.contains(tabScrollButtonClasses.disabled)
  )
}

function hasRightScrollButton(container: HTMLElement): boolean {
  const button = findScrollButton(container, 'right')
  return !!(
    button && !button.classList.contains(tabScrollButtonClasses.disabled)
  )
}

describe('<Tabs />', () => {
  const isJSDOM = navigator.userAgent === 'node.js'

  const { render, clock } = createRenderer()

  before(function () {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    // The test fails on Safari with just:
    //
    // container.scrollLeft = 200;
    // expect(container.scrollLeft).to.equal(200); 💥
    if (isSafari) {
      this.skip()
    }
  })

  it('can be named via `aria-label`', () => {
    const { getByRole } = render(<Tabs aria-label="string label" />)

    expect(getByRole('tablist', { name: 'string label' })).not.null
  })

  it('can be named via `aria-labelledby`', () => {
    const { getByRole } = render(
      <React.Fragment>
        <h3 id="label-id">complex name</h3>
        <Tabs aria-labelledby="label-id" />
      </React.Fragment>
    )

    expect(getByRole('tablist', { name: 'complex name' })).not.null
  })

  describe('prop: ref', () => {
    it('should be able to access updateIndicator function', () => {
      const tabRef = React.createRef<TabsRefAttributes>()

      render(
        <Tabs ref={tabRef} value={0}>
          <Tab />
          <Tab />
        </Tabs>
      )

      expect(tabRef.current!.updateIndicator).to.be.a('function')

      tabRef.current!.updateIndicator()
    })

    it('should be able to access updateScrollButtons function', () => {
      const tabRef = React.createRef<TabsRefAttributes>()

      render(
        <Tabs ref={tabRef} value={0}>
          <Tab />
          <Tab />
        </Tabs>
      )

      expect(tabRef.current!.updateScrollButtons).to.be.a('function')

      tabRef.current!.updateScrollButtons()
    })
  })

  describe('prop: centered', () => {
    it('should render with the centered class', () => {
      const { container } = render(
        <Tabs value={0} centered={true}>
          <Tab />
          <Tab />
        </Tabs>
      )
      const selector = `.${tabsClasses.flexContainer}.${tabsClasses.centered}`
      expect(container.querySelector(selector)!.nodeName).to.equal('DIV')
    })
  })

  describe('prop: children', () => {
    it('should accept a null child', () => {
      const { getAllByRole } = render(
        <Tabs value={0}>
          {null}
          <Tab />
        </Tabs>
      )
      expect(getAllByRole('tab')).to.have.lengthOf(1)
    })

    it('should support empty children', () => {
      render(<Tabs value={1} />)
    })

    it('puts the selected child in tab order', () => {
      const { getAllByRole, setProps } = render(
        <Tabs value={1}>
          <Tab />
          <Tab />
        </Tabs>
      )

      expect(
        getAllByRole('tab').map((tab) => tab.tabIndex)
      ).to.have.ordered.members([-1, 0])

      setProps({ value: 0 })

      expect(
        getAllByRole('tab').map((tab) => tab.tabIndex)
      ).to.have.ordered.members([0, -1])
    })
  })

  describe('prop: value', () => {
    const tabs = (
      <Tabs value={1}>
        <Tab />
        <Tab />
      </Tabs>
    )

    it('should pass selected prop to children', () => {
      const { getAllByRole } = render(tabs)
      const tabElements = getAllByRole('tab')
      expect(tabElements[0]).to.have.attribute('aria-selected', 'false')
      expect(tabElements[1]).to.have.attribute('aria-selected', 'true')
    })

    it('should accept any value as selected tab value', () => {
      const tab0 = {}
      const tab1 = {}

      expect(tab0).not.to.equal(tab1)

      const { getAllByRole } = render(
        <Tabs value={tab0 as any}>
          <Tab value={tab0 as any} />
          <Tab value={tab1 as any} />
        </Tabs>
      )
      const tabElements = getAllByRole('tab')
      expect(tabElements[0]).to.have.attribute('aria-selected', 'true')
      expect(tabElements[1]).to.have.attribute('aria-selected', 'false')
    })

    describe('indicator', () => {
      it('should accept a false value', () => {
        const { container } = render(
          <Tabs value={false}>
            <Tab />
            <Tab />
          </Tabs>
        )

        expect(
          container.querySelector<HTMLElement>(`.${tabsClasses.indicator}`)!
            .style.width
        ).to.equal('0px')
      })

      it('should render the indicator', () => {
        const { container, getAllByRole } = render(
          <Tabs value={1}>
            <Tab />
            <Tab />
          </Tabs>
        )

        const tabElements = getAllByRole('tab')

        expect(tabElements[0].querySelector(`.${tabsClasses.indicator}`)).to
          .null

        expect(tabElements[1].querySelector(`.${tabsClasses.indicator}`)).to
          .null

        expect(container.querySelector(`.${tabsClasses.indicator}`)).not.to.null
      })

      it('should update the indicator at each render', function () {
        if (isJSDOM) {
          this.skip()
        }

        const { forceUpdate, container, getByRole } = render(
          <Tabs value={1}>
            <Tab />
            <Tab />
          </Tabs>
        )
        const tabListContainer = getByRole('tablist').parentElement
        const tab = getByRole('tablist').children[1]

        Object.defineProperty(tabListContainer, 'clientWidth', { value: 100 })
        Object.defineProperty(tabListContainer, 'scrollWidth', { value: 100 })

        Object.defineProperty(tabListContainer, 'getBoundingClientRect', {
          value: () => ({
            left: 0,
            right: 100
          })
        })

        Object.defineProperty(tab, 'getBoundingClientRect', {
          value: () => ({
            left: 50,
            width: 50,
            right: 100
          }),
          configurable: true
        })

        forceUpdate()

        let style

        style = container.querySelector<HTMLElement>(
          `.${tabsClasses.indicator}`
        )!.style

        expect(style.left).to.equal('50px')
        expect(style.width).to.equal('50px')

        Object.defineProperty(tab, 'getBoundingClientRect', {
          value: () => ({
            left: 60,
            width: 50,
            right: 110
          })
        })

        forceUpdate()

        style = container.querySelector<HTMLElement>(
          `.${tabsClasses.indicator}`
        )!.style

        expect(style.left).to.equal('60px')
        expect(style.width).to.equal('50px')
      })
    })
  })

  describe('prop: onChange', () => {
    it('should call onChange when clicking', () => {
      const handleChange = sinon.spy()
      const { getAllByRole } = render(
        <Tabs value={0} onChange={handleChange}>
          <Tab />
          <Tab />
        </Tabs>
      )

      fireEvent.click(getAllByRole('tab')[1])
      expect(handleChange.callCount).to.equal(1)
      expect(handleChange.args[0][0]).to.equal(1)
    })

    it('should not call onChange when already selected', () => {
      const handleChange = sinon.spy()
      const { getAllByRole } = render(
        <Tabs value={0} onChange={handleChange}>
          <Tab />
          <Tab />
        </Tabs>
      )

      fireEvent.click(getAllByRole('tab')[0])
      expect(handleChange.callCount).to.equal(0)
    })

    it('when `selectionFollowsFocus` should call if an unselected tab gets focused', () => {
      const handleChange = sinon.spy()
      const { getAllByRole } = render(
        <Tabs value={0} onChange={handleChange} selectionFollowsFocus>
          <Tab />
          <Tab />
        </Tabs>
      )
      const [, lastTab] = getAllByRole('tab')

      act(() => {
        lastTab.focus()
      })

      expect(handleChange.callCount).to.equal(1)
      expect(handleChange.firstCall.args[0]).to.equal(1)
    })

    it('when `selectionFollowsFocus` should not call if an selected tab gets focused', () => {
      const handleChange = sinon.spy()
      const { getAllByRole } = render(
        <Tabs value={0} onChange={handleChange} selectionFollowsFocus>
          <Tab />
          <Tab />
        </Tabs>
      )
      const [firstTab] = getAllByRole('tab')

      act(() => {
        firstTab.focus()
      })

      expect(handleChange.callCount).to.equal(0)
    })
  })

  describe('prop: variant="scrollable"', () => {
    clock.withFakeTimers()

    const tabs = (
      <Tabs value={0} style={{ width: 200 }} variant="scrollable">
        <Tab style={{ width: 120, minWidth: 'auto' }} />
        <Tab style={{ width: 120, minWidth: 'auto' }} />
        <Tab style={{ width: 120, minWidth: 'auto' }} />
      </Tabs>
    )

    it('should render with the scrollable class', () => {
      const { container } = render(tabs)
      const selector = `.${tabsClasses.scroller}.${tabsClasses.scrollableX}`
      expect(container.querySelector(selector)!.tagName).to.equal('DIV')
      expect(container.querySelectorAll(selector)).to.have.lengthOf(1)
    })

    it('should response to scroll events', function () {
      if (isJSDOM) {
        this.skip()
      }

      const { container, forceUpdate, getByRole } = render(tabs)
      const tabListContainer = getByRole('tablist').parentElement

      Object.defineProperty(tabListContainer, 'clientWidth', {
        value: 200 - 40 * 2
      })

      tabListContainer!.scrollLeft = 10

      Object.defineProperty(tabListContainer, 'scrollWidth', { value: 216 })
      Object.defineProperty(tabListContainer, 'getBoundingClientRect', {
        value: () => ({
          left: 0,
          right: 50
        })
      })

      forceUpdate()

      clock.tick(1000)

      expect(hasLeftScrollButton(container)).to.equal(true)
      expect(hasRightScrollButton(container)).to.equal(true)

      tabListContainer!.scrollLeft = 0

      fireEvent.scroll(
        container.querySelector(
          `.${tabsClasses.scroller}.${tabsClasses.scrollableX}`
        )!
      )

      clock.tick(166)

      expect(hasLeftScrollButton(container)).to.equal(false)
      expect(hasRightScrollButton(container)).to.equal(true)
    })

    it('should get a scrollbar size listener', () => {
      const { setProps, getByRole } = render(
        <Tabs value={0}>
          <Tab />
          <Tab />
        </Tabs>
      )
      const tabListContainer = getByRole('tablist').parentElement

      expect(tabListContainer!.style.overflow).to.equal('hidden')

      setProps({
        variant: 'scrollable'
      })

      expect(tabListContainer!.style.overflow).to.equal('')
    })
  })

  describe('prop: !variant="scrollable"', () => {
    it('should not render with the scrollable class', () => {
      const { container } = render(
        <Tabs value={0}>
          <Tab />
          <Tab />
        </Tabs>
      )
      const baseSelector = `.${tabsClasses.scroller}`
      const selector = `.${tabsClasses.scroller}.${tabsClasses.scrollableX}`

      expect(container.querySelector(baseSelector)).not.to.equal(null)
      expect(container.querySelector(selector)).to.equal(null)
    })
  })

  describe('prop: scrollButtonsProps', () => {
    clock.withFakeTimers()

    it('should render scroll buttons', () => {
      const { container } = render(
        <Tabs value={0} variant="scrollable" scrollButtons={true}>
          <Tab />
          <Tab />
        </Tabs>
      )

      expect(
        container.querySelectorAll(`.${tabScrollButtonClasses.button}`)
      ).to.have.lengthOf(2)
    })

    it('should append className from scrollButtonsProps', () => {
      const { container } = render(
        <Tabs
          value={0}
          variant="scrollable"
          scrollButtons={true}
          scrollButtonsProps={{ className: 'foo' }}
        >
          <Tab />
          <Tab />
        </Tabs>
      )

      expect(
        container.querySelectorAll(`.${tabScrollButtonClasses.button}`)
      ).to.have.lengthOf(2)
      expect(container.querySelectorAll('.foo')).to.have.lengthOf(2)
    })

    it('should not hide scroll buttons when allowScrollButtonsMobile is true', () => {
      const { container } = render(
        <Tabs
          value={0}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          <Tab />
          <Tab />
        </Tabs>
      )

      expect(
        container.querySelectorAll(`.${tabScrollButtonClasses.hideMobile}`)
      ).to.have.lengthOf(0)
    })

    it('should handle window resize event', function () {
      if (isJSDOM) {
        this.skip()
      }

      const { container, forceUpdate, getByRole } = render(
        <Tabs
          value={0}
          variant="scrollable"
          scrollButtons={true}
          style={{ width: 200 }}
        >
          <Tab />
          <Tab />
          <Tab />
        </Tabs>
      )

      const tabListContainer = getByRole('tablist').parentElement

      Object.defineProperty(tabListContainer, 'clientWidth', {
        value: 200 - 40 * 2
      })

      tabListContainer!.scrollLeft = 10

      Object.defineProperty(tabListContainer, 'scrollWidth', { value: 216 })
      Object.defineProperty(tabListContainer, 'getBoundingClientRect', {
        value: () => ({
          left: 0,
          right: 100
        })
      })

      forceUpdate()
      clock.tick(1000)

      expect(hasLeftScrollButton(container)).to.equal(true)
      expect(hasRightScrollButton(container)).to.equal(true)

      tabListContainer!.scrollLeft = 0

      act(() => {
        window.dispatchEvent(new window.Event('resize', {}))
      })

      clock.tick(166)

      expect(hasLeftScrollButton(container)).to.equal(false)
      expect(hasRightScrollButton(container)).to.equal(true)
    })

    describe('scroll button visibility states', () => {
      it('should set neither left nor right scroll button state', () => {
        const { container, forceUpdate, getByRole } = render(
          <Tabs
            value={0}
            variant="scrollable"
            scrollButtons
            style={{ width: 200 }}
          >
            <Tab style={{ width: 50, minWidth: 'auto' }} />
            <Tab style={{ width: 50, minWidth: 'auto' }} />
          </Tabs>
        )
        const tabListContainer = getByRole('tablist').parentElement

        Object.defineProperty(tabListContainer, 'clientWidth', {
          value: 200 - 40 * 2
        })

        Object.defineProperty(tabListContainer, 'scrollWidth', {
          value: 200 - 40 * 2
        })

        forceUpdate()

        expect(hasLeftScrollButton(container)).to.equal(false)
        expect(hasRightScrollButton(container)).to.equal(false)
      })

      it('should set only left scroll button state', () => {
        const { container, forceUpdate, getByRole } = render(
          <Tabs
            value={0}
            variant="scrollable"
            scrollButtons
            style={{ width: 200 }}
          >
            <Tab style={{ width: 120, minWidth: 'auto' }} />
            <Tab style={{ width: 120, minWidth: 'auto' }} />
            <Tab style={{ width: 120, minWidth: 'auto' }} />
          </Tabs>
        )
        const tabListContainer = getByRole('tablist').parentElement

        Object.defineProperty(tabListContainer, 'clientWidth', {
          value: 200 - 40 * 2
        })
        Object.defineProperty(tabListContainer, 'scrollWidth', { value: 216 })

        tabListContainer!.scrollLeft = 96

        forceUpdate()

        expect(hasLeftScrollButton(container)).to.true
        expect(hasRightScrollButton(container)).to.false
      })

      it('should set only right scroll button state', () => {
        const { container, forceUpdate, getByRole } = render(
          <Tabs
            value={0}
            variant="scrollable"
            scrollButtons
            style={{ width: 200 }}
          >
            <Tab />
            <Tab />
            <Tab />
          </Tabs>
        )
        const tabListContainer = getByRole('tablist').parentElement

        Object.defineProperty(tabListContainer, 'clientWidth', {
          value: 200 - 40 * 2
        })

        Object.defineProperty(tabListContainer, 'scrollWidth', { value: 216 })

        tabListContainer!.scrollLeft = 0

        forceUpdate()

        expect(hasLeftScrollButton(container)).to.false
        expect(hasRightScrollButton(container)).to.true
      })

      it('should set both left and right scroll button state', () => {
        const { container, forceUpdate, getByRole } = render(
          <Tabs
            value={0}
            variant="scrollable"
            scrollButtons
            style={{ width: 200 }}
          >
            <Tab style={{ width: 120, minWidth: 'auto' }} />
            <Tab style={{ width: 120, minWidth: 'auto' }} />
          </Tabs>
        )
        const tabListContainer = getByRole('tablist').parentElement

        Object.defineProperty(tabListContainer, 'clientWidth', {
          value: 200 - 40 * 2
        })
        Object.defineProperty(tabListContainer, 'scrollWidth', { value: 216 })

        tabListContainer!.scrollLeft = 5

        forceUpdate()

        expect(hasLeftScrollButton(container)).to.true
        expect(hasRightScrollButton(container)).to.true
      })
    })
  })

  describe('scroll button behavior', () => {
    clock.withFakeTimers()

    it('should scroll visible items', () => {
      const { container, forceUpdate, getByRole, getAllByRole } = render(
        <Tabs
          value={0}
          variant="scrollable"
          scrollButtons={true}
          style={{ width: 200 }}
        >
          <Tab style={{ width: 100, minWidth: 'auto' }} />
          <Tab style={{ width: 50, minWidth: 'auto' }} />
          <Tab style={{ width: 100, minWidth: 'auto' }} />
        </Tabs>
      )
      const tabListContainer = getByRole('tablist').parentElement
      const tabs = getAllByRole('tab')

      Object.defineProperty(tabListContainer, 'clientWidth', {
        value: 200 - 40 * 2
      })
      Object.defineProperty(tabs[0], 'clientWidth', { value: 100 })
      Object.defineProperty(tabs[1], 'clientWidth', { value: 50 })
      Object.defineProperty(tabs[2], 'clientWidth', { value: 100 })
      Object.defineProperty(tabListContainer, 'scrollWidth', {
        value: 100 + 50 + 100
      })

      tabListContainer!.scrollLeft = 20

      forceUpdate()

      clock.tick(1000)

      expect(hasLeftScrollButton(container)).to.be.true
      expect(hasRightScrollButton(container)).to.be.true

      fireEvent.click(findScrollButton(container, 'left')!)

      clock.tick(1000)

      expect(tabListContainer!.scrollLeft).not.to.be.above(0)

      tabListContainer!.scrollLeft = 0

      fireEvent.click(findScrollButton(container, 'right')!)

      clock.tick(1000)

      expect(tabListContainer!.scrollLeft).equal(100)
    })
  })

  describe('scroll into view behavior', () => {
    clock.withFakeTimers()

    it('should scroll left tab into view', function () {
      if (isJSDOM) {
        this.skip()
      }

      const { forceUpdate, getByRole } = render(
        <Tabs value={0} variant="scrollable" style={{ width: 200 }}>
          <Tab style={{ width: 120, minWidth: 'auto' }} />
          <Tab style={{ width: 120, minWidth: 'auto' }} />
          <Tab style={{ width: 120, minWidth: 'auto' }} />
        </Tabs>
      )
      const tabList = getByRole('tablist')
      const tabListContainer = tabList.parentElement
      const tab = tabList.children[0]

      Object.defineProperty(tabListContainer, 'clientWidth', {
        value: 200 - 40 * 2
      })
      Object.defineProperty(tabListContainer, 'scrollWidth', { value: 216 })

      tabListContainer!.scrollLeft = 20

      Object.defineProperty(tabListContainer, 'tabListContainer', {
        value: () => ({
          left: 0,
          right: 100
        })
      })

      Object.defineProperty(tab, 'getBoundingClientRect', {
        value: () => ({
          left: -20,
          width: 50,
          right: 30
        })
      })

      forceUpdate()

      clock.tick(1000)

      expect(tabListContainer!.scrollLeft).to.equal(0)
    })
  })

  describe('prop: TabComponent', () => {
    it('should set another component', () => {
      const { container } = render(
        <Tabs
          value={0}
          TabComponent={({ children }) => (
            <div className="tab-component">{children}</div>
          )}
        >
          <Tab />
          <Tab />
        </Tabs>
      )

      const tabs = container.querySelectorAll(
        `.${tabsClasses.flexContainer} > .tab-component`
      )

      expect(tabs).to.length(2)

      expect(Array.from(tabs).map((value) => value.nodeName)).to.deep.equal([
        'DIV',
        'DIV'
      ])
    })
  })

  describe('prop: ScrollButtonComponent', () => {
    it('should set another component', () => {
      const { container } = render(
        <Tabs
          value={0}
          variant="scrollable"
          scrollButtons={true}
          ScrollButtonComponent={({ children }) => (
            <div className="scroll-button-component">{children}</div>
          )}
        >
          <Tab />
          <Tab />
        </Tabs>
      )

      const tabs = container.querySelectorAll(
        `.${tabsClasses.root} > .scroll-button-component`
      )

      expect(tabs).to.length(2)

      expect(Array.from(tabs).map((value) => value.nodeName)).to.deep.equal([
        'DIV',
        'DIV'
      ])
    })
  })

  describe('prop: indicatorProps', () => {
    it('should merge the style', () => {
      const { container } = render(
        <Tabs
          value={0}
          indicatorProps={{ style: { backgroundColor: 'green' } }}
        >
          <Tab />
        </Tabs>
      )
      const style = container.querySelector<HTMLElement>(
        `.${tabsClasses.indicator}`
      )!.style

      expect(style).to.have.property('backgroundColor', 'green')
    })
  })

  describe('prop: tabProps', () => {
    it('should merge the style', () => {
      const { container } = render(
        <Tabs
          value={0}
          tabProps={{ style: { color: 'purple', backgroundColor: 'yellow' } }}
        >
          <Tab />
        </Tabs>
      )

      const style = container.querySelector<HTMLElement>(
        `.${tabsClasses.flexContainer} .${tabClasses.root}`
      )!.style

      expect(style).to.have.property('color', 'purple')
      expect(style).to.have.property('backgroundColor', 'yellow')
    })
  })

  describe('prop: orientation', () => {
    it('should support orientation="vertical"', function () {
      if (isJSDOM) {
        this.skip()
      }

      const { forceUpdate, container, getByRole } = render(
        <Tabs
          value={1}
          variant="scrollable"
          scrollButtons
          orientation="vertical"
        >
          <Tab />
          <Tab />
        </Tabs>
      )
      const tabList = getByRole('tablist')
      const tabListContainer = tabList.parentElement
      const tab = tabList.children[1]

      Object.defineProperty(tabListContainer, 'clientHeight', { value: 100 })
      Object.defineProperty(tabListContainer, 'scrollHeight', { value: 100 })
      Object.defineProperty(tabListContainer, 'getBoundingClientRect', {
        value: () => ({
          top: 0,
          bottom: 100
        })
      })
      Object.defineProperty(tab, 'getBoundingClientRect', {
        value: () => ({
          top: 50,
          height: 50,
          bottom: 100
        }),
        configurable: true
      })

      forceUpdate()

      let style = container.querySelector<HTMLElement>(
        `.${tabsClasses.indicator}`
      )!.style

      expect(style).to.have.property('top', '50px')
      expect(style).to.have.property('height', '50px')

      Object.defineProperty(tab, 'getBoundingClientRect', {
        value: () => ({
          top: 60,
          height: 50,
          bottom: 110
        })
      })

      forceUpdate()

      style = container.querySelector<HTMLElement>(
        `.${tabsClasses.indicator}`
      )!.style

      expect(style).to.have.property('top', '60px')
      expect(style).to.have.property('height', '50px')
    })

    it('does not add aria-orientation by default', () => {
      const { getByRole } = render(<Tabs value={0} />)

      expect(getByRole('tablist')).not.to.have.attribute('aria-orientation')
    })

    it('adds the proper aria-orientation when vertical', () => {
      const { getByRole } = render(<Tabs value={0} orientation="vertical" />)

      expect(getByRole('tablist')).to.have.attribute(
        'aria-orientation',
        'vertical'
      )
    })
  })
})
