import * as React from 'react'
import { Animated } from 'react-native'
import {
  MasonryFlashList as RNMasonryFlashList,
  MasonryFlashListProps,
  MasonryFlashListRef
} from '@shopify/flash-list'
import useForkRef from '@utils/useForkRef'
import {
  useScrollSync,
  useScrollHandler,
  useScrollableComponentProps
} from '../hooks'

const AnimatedMasonryFlashList =
  Animated.createAnimatedComponent(RNMasonryFlashList)

const MasonryFlashList = React.forwardRef<
  MasonryFlashListRef<any>,
  MasonryFlashListProps<any>
>((props, ref) => {
  const { onScroll, ...other } = props

  const scrollableProps = useScrollableComponentProps(props)
  const scrollableRef = React.useRef<MasonryFlashListRef<any>>(null)
  const forkedRef = useForkRef(ref, scrollableRef)
  const scrollHandler = useScrollHandler(onScroll)

  useScrollSync(scrollableRef)

  return (
    <AnimatedMasonryFlashList
      {...other}
      {...scrollableProps}
      ref={forkedRef}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    />
  )
})

interface MasonryFlashListComponent
  extends React.ForwardRefExoticComponent<MasonryFlashListProps<any>> {
  <T>(
    props: MasonryFlashListProps<T> &
      React.RefAttributes<MasonryFlashListRef<T>>
  ): React.ReactElement
}

export default MasonryFlashList as unknown as MasonryFlashListComponent
