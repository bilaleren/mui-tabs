import * as React from 'react'
import {
  Animated,
  SectionList as RNSectionList,
  DefaultSectionT,
  SectionListProps
} from 'react-native'
import useForkRef from '@utils/useForkRef'
import {
  useScrollSync,
  useScrollHandler,
  useScrollableComponentProps
} from '../hooks'

const SectionList = React.forwardRef<RNSectionList, SectionListProps<any>>(
  (props, ref) => {
    const { onScroll, ...other } = props

    const scrollableProp = useScrollableComponentProps(props)
    const scrollableRef = React.useRef<RNSectionList>(null)
    const forkedRef = useForkRef(ref, scrollableRef)
    const scrollHandler = useScrollHandler(onScroll)

    useScrollSync(scrollableRef)

    return (
      <Animated.SectionList
        {...other}
        {...scrollableProp}
        ref={forkedRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    )
  }
)

interface SectionListComponent
  extends React.ForwardRefExoticComponent<SectionListProps<any>> {
  <ItemT = any, SectionT = DefaultSectionT>(
    props: SectionListProps<ItemT, SectionT> &
      React.RefAttributes<RNSectionList<ItemT, SectionT>>
  ): React.ReactElement
}

export default SectionList as unknown as SectionListComponent
