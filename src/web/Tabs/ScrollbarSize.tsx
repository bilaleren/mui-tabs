import * as React from 'react'
import debounce from 'debounce'
import ownerWindow from '@utils/ownerWindow'
import useLatestCallback from '@utils/useLatestCallback'

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

  const setMeasurements = useLatestCallback(() => {
    const node = nodeRef.current

    if (node) {
      scrollbarHeight.current = node.offsetHeight - node.clientHeight
    }
  })

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
    }, 166)

    const containerWindow = ownerWindow(nodeRef.current)
    containerWindow.addEventListener('resize', handleResize)
    return () => {
      handleResize.clear()
      containerWindow.removeEventListener('resize', handleResize)
    }
  }, [onChange, setMeasurements])

  React.useEffect(() => {
    setMeasurements()
    onChange(scrollbarHeight.current)
  }, [onChange, setMeasurements])

  return <div {...other} ref={nodeRef} style={styles} />
}

export default ScrollbarSize
