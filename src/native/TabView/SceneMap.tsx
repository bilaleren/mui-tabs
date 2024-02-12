import * as React from 'react'
import type { Route, SceneRendererProps } from '../types'

export type SceneProps = {
  route: Route
} & Omit<SceneRendererProps, 'layout'>

const SceneComponent = React.memo(
  <T extends { component: React.ComponentType<any> } & SceneProps>({
    component,
    ...props
  }: T) => {
    return React.createElement(component, props)
  }
)

const SceneMap = <T,>(scenes: { [key: string]: React.ComponentType<T> }) => {
  return ({ route, jumpTo, position }: SceneProps) => (
    <SceneComponent
      key={route.key}
      route={route}
      jumpTo={jumpTo}
      position={position}
      component={scenes[route.key]}
    />
  )
}

export default SceneMap
