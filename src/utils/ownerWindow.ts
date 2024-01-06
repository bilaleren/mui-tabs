import ownerDocument from './ownerDocument'

function ownerWindow(node: Node | undefined): Window {
  const doc = ownerDocument(node)
  return doc.defaultView || window
}

export default ownerWindow
