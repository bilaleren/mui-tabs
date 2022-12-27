import * as React from 'react'
import Code from './Code'
import clsx from 'clsx'

interface ExampleProps {
  id?: string
  title?: string
  children?: (
    value: number,
    setValue: (value: number) => void
  ) => React.ReactNode
  description?: React.ReactNode
  isSubExample?: boolean
  exampleCode?: string
  useTabContent?: boolean
  TabContainerProps?: React.HTMLAttributes<HTMLDivElement>
  renderTabContent?: (value: number) => React.ReactNode
  defaultShowCode?: boolean
}

const defaultRenderTabContent = (value: number) => `Selected tab: ${value}`

const Example: React.FC<ExampleProps> = (props) => {
  const {
    id,
    title,
    children,
    description,
    isSubExample,
    exampleCode,
    useTabContent = true,
    TabContainerProps = {},
    defaultShowCode = false,
    renderTabContent = defaultRenderTabContent
  } = props
  const [value, setValue] = React.useState(1)
  const [showCode, setShowCode] = React.useState(defaultShowCode)

  return (
    <div
      id={id}
      className={
        isSubExample ? 'sub-code-example-container' : 'code-example-container'
      }
    >
      {title && <>{isSubExample ? <h3>{title}</h3> : <h2>{title}</h2>}</>}
      {description && <p>{description}</p>}
      {children && (
        <div
          {...TabContainerProps}
          className={clsx('tab-container', TabContainerProps.className)}
        >
          {children(value, setValue)}
          {useTabContent && (
            <div className="tab-content">{renderTabContent(value)}</div>
          )}
        </div>
      )}
      {exampleCode && (
        <>
          <button
            className="toggle-example-code"
            onClick={() => setShowCode((prevState) => !prevState)}
          >
            {showCode ? 'Hide' : 'Show'} code
          </button>
          {showCode && <Code code={exampleCode.trim()} />}
        </>
      )}
    </div>
  )
}

export default Example
