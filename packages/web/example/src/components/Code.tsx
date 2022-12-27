import * as React from 'react'
import Prismjs from 'prismjs'

import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx.min'
import 'prismjs/components/prism-markdown.min'
import 'prismjs/plugins/toolbar/prism-toolbar.min'
import 'prismjs/plugins/toolbar/prism-toolbar.min.css'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'

interface CodeProps {
  code: string
  language?: string
}

const Code: React.FC<CodeProps> = (props) => {
  const { code, language = 'jsx' } = props

  React.useEffect(() => {
    Prismjs.highlightAll()
  }, [])

  return (
    <div className="code">
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

export default Code
