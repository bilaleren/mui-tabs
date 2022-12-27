import * as React from 'react'
import setRef from './setRef'

function useForkRef<InstanceA, InstanceB>(
  refA: React.Ref<InstanceA> | null | undefined,
  refB: React.Ref<InstanceB> | null | undefined
): React.Ref<InstanceA & InstanceB> | null {
  return React.useMemo(() => {
    if (refA == null && refB == null) {
      return null
    }
    return (refValue) => {
      setRef(refA, refValue)
      setRef(refB, refValue)
    }
  }, [refA, refB])
}

export default useForkRef
