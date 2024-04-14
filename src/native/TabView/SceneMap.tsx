import * as React from 'react'
import type { SceneProps } from '../types'

const SceneComponent = React.memo(
  <T extends { component: React.ComponentType<any> } & SceneProps>({
    component,
    ...props
  }: T) => React.createElement(component, props)
)

const SceneMap = <T,>(scenes: { [key: string]: React.ComponentType<T> }) => {
  return ({ route, ...props }: SceneProps) => (
    <SceneComponent
      {...props}
      key={route.key}
      route={route}
      component={scenes[route.key]}
    />
  )
}

export default SceneMap
