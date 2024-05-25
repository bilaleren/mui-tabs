import * as React from 'react'
import {
  Animated,
  ScrollView as RNScrollView,
  ScrollViewProps
} from 'react-native'
import useForkRef from '@utils/useForkRef'
import {
  useScrollSync,
  useScrollHandler,
  useScrollableComponentProps
} from '../hooks'

const ScrollView = React.forwardRef<RNScrollView, ScrollViewProps>(
  (props, ref) => {
    const { children, onScroll, ...other } = props

    const scrollableProps = useScrollableComponentProps(props, true)
    const scrollableRef = React.useRef<RNScrollView>(null)
    const forkedRef = useForkRef(ref, scrollableRef)
    const scrollHandler = useScrollHandler(onScroll)

    useScrollSync(scrollableRef)

    return (
      <Animated.ScrollView
        {...other}
        {...scrollableProps}
        ref={forkedRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {children}
      </Animated.ScrollView>
    )
  }
)

export default ScrollView
