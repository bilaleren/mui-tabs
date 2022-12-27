import * as React from 'react'
import debounce from '@mui-tabs/utils/src/debounce'
import ownerWindow from '@mui-tabs/utils/src/ownerWindow'

const styles: React.CSSProperties = {
  width: 99,
  height: 99,
  position: 'absolute',
  top: -9999,
  overflow: 'scroll'
}

type HTMLDivElementAttributes = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
>

interface ScrollbarSizeProps extends HTMLDivElementAttributes {
  onChange: (value: number) => void
}

const ScrollbarSize: React.FC<ScrollbarSizeProps> = (props) => {
  const { onChange, ...other } = props
  const scrollbarHeight = React.useRef<number>(0)
  const nodeRef = React.useRef<HTMLDivElement | null>(null)

  const setMeasurements = () => {
    const node = nodeRef.current

    if (node) {
      scrollbarHeight.current = node.offsetHeight - node.clientHeight
    }
  }

  React.useEffect(() => {
    if (!nodeRef.current) {
      return
    }

    const handleResize = debounce(() => {
      const prevHeight = scrollbarHeight.current

      setMeasurements()

      if (prevHeight !== scrollbarHeight.current) {
        onChange(scrollbarHeight.current)
      }
    })

    const containerWindow = ownerWindow(nodeRef.current)
    containerWindow.addEventListener('resize', handleResize)
    return () => {
      handleResize.clear()
      containerWindow.removeEventListener('resize', handleResize)
    }
  }, [onChange])

  React.useEffect(() => {
    setMeasurements()
    onChange(scrollbarHeight.current)
  }, [onChange])

  return <div {...other} ref={nodeRef} style={styles} />
}

export default ScrollbarSize
