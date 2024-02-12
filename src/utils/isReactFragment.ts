import type * as React from 'react'

const REACT_ELEMENT_TYPE = Symbol.for('react.element')
const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment')

function isReactFragment(value: any): value is Iterable<React.ReactNode> {
  if (value != null && typeof value === 'object') {
    const $$typeof = value.$$typeof
    return $$typeof === REACT_ELEMENT_TYPE && value.type === REACT_FRAGMENT_TYPE
  }

  return false
}

export default isReactFragment
