export type DocumentDir = 'ltr' | 'rtl'

function getDocumentDir(): DocumentDir {
  return (
    typeof document !== 'undefined' && document.dir ? document.dir : 'ltr'
  ) as DocumentDir
}

export default getDocumentDir
