import * as React from 'react'
import type { SceneProps } from '../types'

const SceneComponent = React.memo(
  <T extends { component: React.ComponentType<any> } & SceneProps>({
    component,
    ...props
  }: T) => {
    return React.createElement(component, props)
  }
)

const SceneMap = <T,>(scenes: { [key: string]: React.ComponentType<T> }) => {
  return ({ index, route, jumpTo, position }: SceneProps) => (
    <SceneComponent
      key={route.key}
      index={index}
      route={route}
      jumpTo={jumpTo}
      position={position}
      component={scenes[route.key]}
    />
  )
}

export default SceneMap
