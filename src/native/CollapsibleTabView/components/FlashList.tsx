import * as React from 'react'
import { Animated } from 'react-native'
import { FlashList as RNFlashList, FlashListProps } from '@shopify/flash-list'
import useForkRef from '@utils/useForkRef'
import {
  useScrollSync,
  useScrollHandler,
  useScrollableComponentProps
} from '../hooks'

const AnimatedFlashList = Animated.createAnimatedComponent(RNFlashList)

const FlashList = React.forwardRef<RNFlashList<any>, FlashListProps<any>>(
  (props, ref) => {
    const { onScroll, ...other } = props

    const scrollableProps = useScrollableComponentProps(props)
    const scrollableRef = React.useRef<RNFlashList<any>>(null)
    const forkedRef = useForkRef(ref, scrollableRef)
    const scrollHandler = useScrollHandler(onScroll)

    useScrollSync(scrollableRef)

    return (
      <AnimatedFlashList
        {...other}
        {...scrollableProps}
        ref={forkedRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    )
  }
)

interface FlashListComponent
  extends React.ForwardRefExoticComponent<FlashListProps<any>> {
  <ItemT>(
    props: FlashListProps<ItemT> & React.RefAttributes<RNFlashList<ItemT>>
  ): React.ReactElement
}

export default FlashList as unknown as FlashListComponent
