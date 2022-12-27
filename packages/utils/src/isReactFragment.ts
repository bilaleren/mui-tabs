const REACT_ELEMENT_TYPE = Symbol.for('react.element')
const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment')

function isReactFragment(object: any): boolean {
  if (typeof object === 'object' && object !== null) {
    const $$typeof = object.$$typeof

    return (
      $$typeof === REACT_ELEMENT_TYPE && object.type === REACT_FRAGMENT_TYPE
    )
  }
  return false
}

export default isReactFragment
