import * as React from 'react'
import {
  act as rtlAct,
  cleanup,
  render as testingLibraryRender,
  RenderResult as TestingLibraryRenderResult
} from '@testing-library/react'
import { useFakeTimers } from 'sinon'
import { fireEvent } from '@testing-library/dom'

export interface RenderResult extends TestingLibraryRenderResult {
  forceUpdate(): void
  /**
   * convenience helper. Better than repeating all props.
   */
  setProps(props: object): void
}

interface RenderConfiguration {
  /**
   * https://testing-library.com/docs/react-testing-library/api#container
   */
  container?: HTMLElement
  /**
   * if true does not cleanup before mount
   */
  disableUnmount?: boolean
  /**
   * wrap in React.StrictMode?
   */
  strict?: boolean
  /**
   * Set to `true` if the test fails due to [Strict Effects](https://github.com/reactwg/react-18/discussions/19).
   */
  strictEffects?: boolean
}

interface ClientRenderConfiguration extends RenderConfiguration {
  /**
   * https://testing-library.com/docs/react-testing-library/api#hydrate
   */
  hydrate: boolean
}

function render(
  element: React.ReactElement,
  configuration: ClientRenderConfiguration
): RenderResult {
  const { container, hydrate } = configuration

  const testingLibraryRenderResult = testingLibraryRender(element, {
    container,
    hydrate
  })

  return {
    ...testingLibraryRenderResult,
    forceUpdate() {
      testingLibraryRenderResult.rerender(
        React.cloneElement(element, {
          'data-force-update': String(Math.ceil(Math.random() * 1000))
        })
      )
    },
    setProps(props) {
      testingLibraryRenderResult.rerender(React.cloneElement(element, props))
    }
  }
}

interface Clock {
  /**
   * Runs all timers until there are no more remaining.
   * WARNING: This may cause an infinite loop if a timeout constantly schedules another timeout.
   * Prefer to to run only pending timers with `runToLast` and unmount your component directly.
   */
  runAll(): void
  /**
   * Runs only the currently pending timers.
   */
  runToLast(): void
  /**
   * Tick the clock ahead `timeoutMS` milliseconds.
   * @param timeoutMS
   */
  tick(timeoutMS: number): void
  /**
   * Returns true if we're running with "real" i.e. native timers.
   */
  isReal(): boolean
  /**
   * Runs the current test suite (i.e. `describe` block) with fake timers.
   */
  withFakeTimers(): void
}

type ClockConfig = undefined | number | Date

function createClock(defaultMode: 'fake' | 'real', config: ClockConfig): Clock {
  let clock: ReturnType<typeof useFakeTimers> | null = null

  let mode = defaultMode

  beforeEach(() => {
    if (mode === 'fake') {
      clock = useFakeTimers({
        now: config,
        // useIsFocusVisible schedules a global timer that needs to persist regardless of whether components are mounted or not.
        // Technically we'd want to reset all modules between tests but we don't have that technology.
        // In the meantime just continue to clear native timers like with did for the past years when using `sinon` < 8.
        shouldClearNativeTimers: true
      })
    }
  })

  afterEach(() => {
    if (clock) {
      clock.restore()
    }
    clock = null
  })

  return {
    tick(timeoutMS: number) {
      if (clock === null) {
        throw new Error(
          `Can't advance the real clock. Did you mean to call this on fake clock?`
        )
      }

      rtlAct(() => {
        clock!.tick(timeoutMS)
      })
    },
    runAll() {
      if (clock === null) {
        throw new Error(
          `Can't advance the real clock. Did you mean to call this on fake clock?`
        )
      }

      rtlAct(() => {
        clock!.runAll()
      })
    },
    runToLast() {
      if (clock === null) {
        throw new Error(
          `Can't advance the real clock. Did you mean to call this on fake clock?`
        )
      }

      rtlAct(() => {
        clock!.runToLast()
      })
    },
    isReal() {
      // eslint-disable-next-line no-prototype-builtins
      return !setTimeout.hasOwnProperty('clock')
    },
    withFakeTimers() {
      before(() => {
        mode = 'fake'
      })

      after(() => {
        mode = defaultMode
      })
    }
  }
}

export type RenderOptions = Partial<RenderConfiguration>

export interface CreateRendererOptions {
  /**
   * @default 'real'
   */
  clock?: 'fake' | 'real'
  clockConfig?: ClockConfig
}

export function createRenderer(globalOptions: CreateRendererOptions = {}) {
  const { clock: clockMode = 'real', clockConfig } = globalOptions
  const clock = createClock(clockMode, clockConfig)

  let prepared = false

  beforeEach(() => {
    prepared = true
  })

  afterEach(() => {
    if (!clock.isReal()) {
      throw new Error(
        "Can't cleanup before fake timers are restored.\n" +
          'Be sure to:\n' +
          '  1. Only use `clock` from `createRenderer`.\n' +
          '  2. Call `createRenderer` in a suite and not any test hook (e.g. `beforeEach`) or test itself (e.g. `it`).'
      )
    }

    cleanup()
  })

  return {
    clock,
    render(
      element: React.ReactElement,
      options: RenderOptions = {}
    ): RenderResult {
      if (!prepared) {
        throw new Error(
          'Unable to finish setup before `render()` was called. ' +
            'This usually indicates that `render()` was called in a `before()` or `beforeEach` hook. ' +
            'Move the call into each `it()`. Otherwise you cannot run a specific test and we cannot isolate each test.'
        )
      }

      return render(element, {
        ...options,
        hydrate: false
      })
    }
  }
}

export function focusVisible(element: HTMLElement): void {
  rtlAct(() => {
    element.blur()
    fireEvent.keyDown(document.body, { key: 'Tab' })
    element.focus()
  })
}

export function simulatePointerDevice(): void {
  fireEvent.pointerDown(document.body)
}
