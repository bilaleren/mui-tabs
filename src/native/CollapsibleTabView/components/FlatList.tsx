import * as React from 'react'
import { Animated, FlatList as RNFlatList, FlatListProps } from 'react-native'
import useForkRef from '@utils/useForkRef'
import {
  useScrollSync,
  useScrollHandler,
  useScrollableComponentProps
} from '../hooks'

const FlatList = React.forwardRef<RNFlatList, FlatListProps<any>>(
  (props, ref) => {
    const { onScroll, ...other } = props

    const scrollableProps = useScrollableComponentProps(props)
    const scrollableRef = React.useRef<RNFlatList>(null)
    const forkedRef = useForkRef(ref, scrollableRef)
    const scrollHandler = useScrollHandler(onScroll)

    useScrollSync(scrollableRef)

    return (
      <Animated.FlatList
        {...other}
        {...scrollableProps}
        ref={forkedRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    )
  }
)

interface FlatListComponent
  extends React.ForwardRefExoticComponent<FlatListProps<any>> {
  <TItem>(
    props: FlatListProps<TItem> & React.RefAttributes<RNFlatList<TItem>>
  ): React.ReactElement
}

export default FlatList as unknown as FlatListComponent
